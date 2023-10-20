# Import python packages
import streamlit as st
import pandas as pd
from snowflake.snowpark.context import get_active_session
from snowflake.snowpark.functions import col

st.set_page_config(
    page_title="LLM Powered Functions",
    layout='wide'
)

st.title("LLM Powered Functions")

# Get the current credentials
session = get_active_session()
model = "llama2-7b-chat-hf"

@st.cache_data()
def load_transcripts(languages):
    df_transcripts = session.table('transcripts').select('transcript').filter(col('LANGUAGE').in_(languages)).to_pandas()
    return df_transcripts

@st.cache_data()
def get_llmfps_response(prompt):
    prompt = prompt.replace("'", "\\'")
    # print(prompt)
    llmpfs_prompt = "'[INST] " + prompt + " [/INST]'"
    df = session.sql(f"select snowflake.ml.complete('llama2-7b-chat', {llmpfs_prompt}) as response").to_pandas()
    return df.iloc[0]['RESPONSE']
    
def sentiment_analysis():
    st.subheader("Sentiment Analysis")
    entered_phrase = st.text_input("Enter a sentiment",label_visibility="hidden",placeholder='For example: My puppy is adorable ❤️❤️')
    if entered_phrase:
        st.caption(f"{model} response")
        st.write(get_llmfps_response(f"\"Classify this sentiment: {entered_phrase}\""))

def share_knowledge():
    st.subheader("Share Knowledge")
    entered_subject = st.text_input("Enter subject",label_visibility="hidden",placeholder='For example: Thoughts on OpenAI')
    if entered_subject:
        st.caption(f"{model} response")
        st.write(get_llmfps_response(f"\"Share your knowledge on subject: {entered_subject}\""))

def summarize_transcripts():
    st.subheader("Select a transcript")
    df_transcripts = load_transcripts(['English'])
    selected_transcript = st.selectbox("Select a transcript",df_transcripts,label_visibility="hidden")    
    if selected_transcript:
        st.caption(f"{model} response")
        st.write(get_llmfps_response(f"\"Summarize this transcript: {selected_transcript}\""))

def translate():
    st.subheader("Select a transcript")
    df_transcripts = load_transcripts(['German','French'])
    selected_transcript = st.selectbox("Select a transcript",df_transcripts,label_visibility="hidden")    
    if selected_transcript:
        st.caption(f"{model} response")
        st.write(get_llmfps_response(f"\"Translate this into English: {selected_transcript}\""))

# def summarize():
#     st.subheader("Summarize")
#     entered_transcript = st.text_area("Enter transcript",label_visibility="hidden",height=300,placeholder='For example: Phone conversation')
#     if entered_transcript:
#         st.caption(f"{model} response")
#         st.write(get_llmfps_response(f"\"Summarize this transcript: {entered_transcript}\""))

page_names_to_funcs = {
    "Summarize": summarize_transcripts,
    "Translate": translate,
    "Sentiment Analysis": sentiment_analysis,
    "Share Knowledge": share_knowledge
}

selected_page = st.sidebar.selectbox("Select", page_names_to_funcs.keys())
page_names_to_funcs[selected_page]()