import streamlit as st
import numpy as np
import joblib
import tensorflow as tf
from google import genai
GEMINI_API_KEY = "AIzaSyAWy75jshxE2XMpJNGqNVCUG03MaMKYQ9o" # JANGAN LUPA GANTI INI LAGI
client = genai.Client(api_key=GEMINI_API_KEY)

@st.cache_resource
def load_ml_components():
    model = tf.keras.models.load_model('model_klasifikasi_performa.keras')
    scaler = joblib.load('scaler_mahasiswa.pkl')
    return model, scaler

dl_model, scaler = load_ml_components()

st.set_page_config(page_title="AI Edu-Mentor", layout="wide")
st.title("🎓 AI Edu-Mentor: Sistem Prediksi & Panduan Belajar")

st.sidebar.header("📝 Profil Belajar Anda")

# TAMBAH 2 SLIDER BARU UNTUK VARIABEL DOMINAN
last_exam = st.sidebar.slider("Nilai Ujian Terakhir (0-100)", 0, 100, 85)
attendance = st.sidebar.slider("Persentase Kehadiran (0-100%)", 0, 100, 90)

st.sidebar.markdown("---")
ai_dependency = st.sidebar.slider("Tingkat Ketergantungan pada AI (1-10)", 1, 10, 5)
concept_understanding = st.sidebar.slider("Skor Pemahaman Konsep (1-10)", 1, 10, 5)
ai_usage_time = st.sidebar.number_input("Durasi Penggunaan AI per hari (Menit)", min_value=0, max_value=600, value=60)
study_consistency = st.sidebar.slider("Indeks Konsistensi Belajar (1-10)", 1, 10, 5)

if st.sidebar.button("Mulai Analisis AI"):
    with st.spinner("Deep Learning sedang menganalisis pola Anda..."):

        input_data = scaler.mean_.copy()

        # MASUKKAN INDEKS VARIABEL BARU KE ARRAY
        # Berdasarkan urutan dataset Anda, last_exam_score ada di indeks 8, attendance di 10
        input_data[8] = last_exam
        input_data[10] = attendance

        input_data[3] = ai_usage_time
        input_data[4] = ai_dependency
        input_data[11] = concept_understanding
        input_data[12] = study_consistency

        input_scaled = scaler.transform([input_data])
        prediksi_prob = dl_model.predict(input_scaled)
        prediksi_kelas = np.argmax(prediksi_prob, axis=1)[0]

        kategori_map = {0: "Low (Rendah)", 1: "Medium (Menengah)", 2: "High (Tinggi)"}
        kategori_hasil = kategori_map[prediksi_kelas]
        st.success(f"**Hasil Analisis Prediktif (Deep Learning):** Kategori Performa Anda adalah **{kategori_hasil}**")

    with st.spinner("AI Edu-Mentor sedang menyusun panduan belajar..."):
        prompt_mentah = """
        Kamu adalah seorang Psikolog Pendidikan dan Mentor Akademik yang sangat empatik.
        Berdasarkan analisis Deep Learning, mahasiswa atau siswa ini diprediksi masuk kategori performa: "{0}".
        Profil belajarnya:
        - Nilai ujian terakhir: {1}
        - Kehadiran: {2}%
        - Ketergantungan AI: {3}/10
        - Pemahaman konsep: {4}/10

        Buat evaluasi interpretatif layaknya tes kepribadian dan berikan 3 poin rekomendasi langkah belajar spesifik.
        """

        prompt = prompt_mentah.format(kategori_hasil, last_exam, attendance, ai_dependency, concept_understanding)

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )

        st.write("---")
        st.subheader("Pesan dari AI Edu-Mentor Bestie Edu :D")
        st.markdown(response.text)
