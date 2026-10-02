from langchain_chroma import Chroma
from langchain_ollama import OllamaLLM
from langchain_classic.chains import RetrievalQA

from .config import CHROMA_PATH, LLM_MODEL, TOP_K
from .embeddings import get_embeddings


def load_vectorstore():
    embeddings = get_embeddings()
    return Chroma(
        persist_directory=str(CHROMA_PATH),
        embedding_function=embeddings,
    )


def build_qa_chain():
    db = load_vectorstore()
    retriever = db.as_retriever(search_kwargs={"k": TOP_K})
    llm = OllamaLLM(model=LLM_MODEL)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
    )
    return qa_chain
