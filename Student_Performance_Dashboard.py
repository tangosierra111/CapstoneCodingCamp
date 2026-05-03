import streamlit as st
import pandas as pd
import altair as alt

# config
st.set_page_config(
    page_title="Student Performance Dashboard",
    layout="wide"
)

st.title("Dashboard Analisis Performa Mahasiswa & Penggunaan AI")
st.markdown("Analisis hubungan kebiasaan belajar dan penggunaan AI terhadap performa mahasiswa.")

# load data
@st.cache_data
def load_data():
    df = pd.read_csv("CLEANED_ai_impact_student_performance_dataset.csv")
    return df

df = load_data()

# mapping kategori
category_map = {
    0: "Low",
    1: "Medium",
    2: "High"
}
df["performance_category_label"] = df["performance_category"].map(category_map)

# sidebar filter
st.sidebar.header("Filter Data")

selected_category = st.sidebar.multiselect(
    "Pilih Kategori Performa",
    options=df["performance_category_label"].unique(),
    default=df["performance_category_label"].unique()
)

study_hours = st.sidebar.slider(
    "Study Hours per Day",
    float(df["study_hours_per_day"].min()),
    float(df["study_hours_per_day"].max()),
    (float(df["study_hours_per_day"].min()), float(df["study_hours_per_day"].max()))
)

ai_usage = st.sidebar.slider(
    "AI Usage Hours",
    float(df["ai_usage_hours"].min()),
    float(df["ai_usage_hours"].max()),
    (float(df["ai_usage_hours"].min()), float(df["ai_usage_hours"].max()))
)

filtered_df = df[
    (df["performance_category_label"].isin(selected_category)) &
    (df["study_hours_per_day"].between(study_hours[0], study_hours[1])) &
    (df["ai_usage_hours"].between(ai_usage[0], ai_usage[1]))
]

# 1. Overview
st.subheader("Distribusi Kategori Performa")

dist_chart = alt.Chart(filtered_df).mark_bar().encode(
    x=alt.X("performance_category_label:N", title="Kategori"),
    y=alt.Y("count()", title="Jumlah Mahasiswa"),
    color="performance_category_label"
)

st.altair_chart(dist_chart, use_container_width=True)

# 2. Kebiasaan Belajar
st.subheader("Pengaruh Kebiasaan Belajar terhadap Performa")

study_chart = alt.Chart(filtered_df).mark_circle(size=60).encode(
    x="study_hours_per_day",
    y="final_score",
    color="performance_category_label",
    tooltip=["study_hours_per_day", "final_score"]
).interactive()

st.altair_chart(study_chart, use_container_width=True)

consistency_chart = alt.Chart(filtered_df).mark_boxplot().encode(
    x="performance_category_label",
    y="study_consistency_index",
    color="performance_category_label"
)

st.altair_chart(consistency_chart, use_container_width=True)

# 3. Penggunaan AI
st.subheader("Pengaruh Penggunaan AI terhadap Performa")

ai_ratio_chart = alt.Chart(filtered_df).mark_circle(size=60).encode(
    x="ai_study_ratio",
    y="final_score",
    color="performance_category_label",
    tooltip=["ai_study_ratio", "final_score"]
).interactive()

st.altair_chart(ai_ratio_chart, use_container_width=True)

dependency_chart = alt.Chart(filtered_df).mark_boxplot().encode(
    x="performance_category_label",
    y="ai_dependency_score",
    color="performance_category_label"
)

st.altair_chart(dependency_chart, use_container_width=True)

# 4. Faktor Pembeda
st.subheader("Faktor Pembeda Utama Antar Kategori")

agg_df = filtered_df.groupby("performance_category_label").agg({
    "study_hours_per_day": "mean",
    "study_consistency_index": "mean",
    "ai_study_ratio": "mean",
    "ai_dependency_score": "mean",
    "concept_understanding_score": "mean"
}).reset_index()

agg_df = agg_df.melt(id_vars="performance_category_label")

diff_chart = alt.Chart(agg_df).mark_bar().encode(
    x="variable:N",
    y="value:Q",
    color="performance_category_label",
    column="performance_category_label"
)

st.altair_chart(diff_chart, use_container_width=True)

# 5. Insights
st.subheader("Insights")

st.markdown("""
- Mahasiswa dengan study consistency tinggi cenderung memiliki performa lebih baik.
- Penggunaan AI yang seimbang (ai_study_ratio moderat) berkorelasi dengan performa optimal.
- Ketergantungan tinggi terhadap AI (ai_dependency_score tinggi) tidak selalu menghasilkan nilai tinggi.
- Faktor pemahaman konsep tetap menjadi penentu utama performa.
""")