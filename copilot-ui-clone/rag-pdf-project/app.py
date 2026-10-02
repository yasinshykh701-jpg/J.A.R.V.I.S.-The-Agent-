from src.rag_chain import build_qa_chain

def main():
    qa_chain = build_qa_chain()

    print("RAG PDF chatbot ready. Type 'exit' to quit.")
    while True:
        query = input("\nAsk a question: ").strip()
        if query.lower() == "exit":
            break

        result = qa_chain.invoke({"query": query})
        print("\nAnswer:\n", result["result"])

        print("\nSources:")
        for i, doc in enumerate(result["source_documents"], 1):
            page = doc.metadata.get("page", "unknown")
            source = doc.metadata.get("source", "unknown")
            print(f"{i}. page={page}, source={source}")

if __name__ == "__main__":
    main()