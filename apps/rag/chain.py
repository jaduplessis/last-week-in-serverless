from langchain_openai import ChatOpenAI

from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableParallel
from prompt import prompt

def retrieve_and_generate(vectorstore):

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # Retrieve and generate using the relevant snippets of the blog.
    retriever = vectorstore.as_retriever()
    
    prompt = prompt
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    rag_chain_from_docs = (
        RunnablePassthrough.assign(context=(lambda x: format_docs(x["context"])))
        | prompt
        | llm
        | StrOutputParser()
    )

    rag_chain = RunnableParallel(
        {"context": retriever, "question": RunnablePassthrough()}
    ).assign(answer=rag_chain_from_docs)

    return rag_chain


def invoke_rag_chain(rag_chain, question):
    response = rag_chain.invoke(question)
    context = response['context'][0]

    answer = response['answer']
    source = context.metadata['source']
    content = context.page_content

    return {"answer": answer, "source": source, "content": content}