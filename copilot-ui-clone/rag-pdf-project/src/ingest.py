from pathlib import Path
import shutil

from pypdf import PdfReader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

from .config import PDF_PATH, CHROMA_PATH, CHUNK_SIZE, CHUNK_OVERLAP, DATA_DIR
from .embeddings import get_embeddings
from .utils import ensure_dir


def resolve_pdf_paths(pdf_path: Path) -> list[Path]:
    if pdf_path.is_file() and pdf_path.suffix.lower() == ".pdf":
        return [pdf_path]

    search_dir = pdf_path if pdf_path.is_dir() else DATA_DIR
    pdfs = sorted(search_dir.glob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError(
            f"No PDF files found in {search_dir}. "
            f"Place one or more .pdf files in the data folder and try again."
        )
    return pdfs


def load_pdf(pdf_path: Path) -> list[Document]:
    reader = PdfReader(str(pdf_path))
    documents = []

    for i, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            documents.append(
                Document(
                    page_content=text,
                    metadata={"source": str(pdf_path.name), "page": i},
                )
            )
    return documents


def load_documents(pdf_path: Path) -> list[Document]:
    documents = []
    for path in resolve_pdf_paths(pdf_path):
        page_docs = load_pdf(path)
        if not page_docs:
            print(f"Warning: no extractable text in {path.name}, skipping.")
            continue
        print(f"Loaded {len(page_docs)} page(s) from {path.name}")
        documents.extend(page_docs)
    return documents


def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(documents)
    return [chunk for chunk in chunks if chunk.page_content.strip()]


def ingest_pdf():
    ensure_dir(CHROMA_PATH)

    documents = load_documents(PDF_PATH)
    chunks = split_documents(documents)

    if not chunks:
        raise ValueError(
            "No readable text found in the PDF(s). "
            "If your PDF is scanned/image-only, install Poppler + Tesseract for OCR."
        )

    # Rebuild the store so re-running ingest does not duplicate chunks
    if CHROMA_PATH.exists():
        shutil.rmtree(CHROMA_PATH)
    ensure_dir(CHROMA_PATH)

    embeddings = get_embeddings()
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_PATH),
    )
    print(f"Indexed {len(chunks)} chunk(s) into {CHROMA_PATH}")
    return db


if __name__ == "__main__":
    ingest_pdf()
    print("PDF ingested and vector store created successfully.")
