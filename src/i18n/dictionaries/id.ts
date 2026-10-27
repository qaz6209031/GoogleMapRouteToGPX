// Machine-assisted translation — needs native-speaker review.
import type { Dictionary } from "../dictionary";

export const id: Dictionary = {
  nav: {
    howItWorks: "Cara Kerja",
    feedback: "Masukan",
    faq: "FAQ",
  },
  hero: {
    badge: "Dipercaya oleh 2K+ pengguna di 50+ negara",
    titleLine1: "Rute Google Maps",
    titleLine2: "ke File GPX",
    subtitle:
      "Ubah URL rute Google Maps apa pun menjadi file GPX untuk perangkat GPS Anda — mengemudi, bersepeda, atau berjalan kaki.",
    subtitleBold: "Tanpa daftar. Tanpa email. Cukup tempel dan jalan.",
  },
  announcement: {
    badge: "Diperbaiki",
    text:
      "Rute yang Anda ubah bentuknya dengan menyeret di Google Maps kini tetap tersimpan di GPX, bersama opsi “hindari jalan raya / tol / feri”. Terima kasih atas masukannya!",
  },
  trustBadges: {
    gpxStandard: "Standar GPX 1.1",
    exactRoute: "Rute Google Maps yang akurat",
    allModes: "Semua mode perjalanan",
    noSignup: "Tanpa perlu daftar",
  },
  features: {
    heading: "Mengapa MapsToGPX?",
    subheading:
      "Semua yang Anda butuhkan untuk mengubah rute Google Maps menjadi file GPX.",
    items: [
      {
        title: "Tanpa Perlu Akun",
        description:
          "Berbeda dari alat lain, kami tidak meminta email Anda atau mengharuskan Anda membuat akun. Cukup tempel URL dan unduh GPX Anda — langsung jadi.",
      },
      {
        title: "Rute Google Maps yang Akurat",
        description:
          "Rute sama persis dengan yang ditampilkan Google Maps — mengemudi, bersepeda, atau berjalan kaki. Jalan, jalur, dan belokan yang sama.",
      },
      {
        title: "Semua Mode Perjalanan",
        description:
          "Berfungsi untuk rute mengemudi, bersepeda, berjalan kaki, dan transit. Mode perjalanan terdeteksi otomatis dari URL Anda.",
      },
      {
        title: "Kompatibilitas Universal",
        description:
          "Format GPX 1.1 standar berfungsi dengan Garmin, Bryton, Wahoo, dan perangkat apa pun yang mendukung GPX.",
      },
      {
        title: "Dipercaya oleh Ribuan Pengguna",
        description:
          "Digunakan oleh 2,000+ pengguna di seluruh dunia. Tanpa daftar, tanpa biaya tersembunyi — hanya file GPX.",
      },
      {
        title: "Semua Format URL",
        description:
          "Mendukung URL panjang, tautan pendek (goo.gl), alamat, koordinat, dan rute dengan banyak titik henti.",
      },
    ],
  },
  howItWorks: {
    heading: "Cara Kerja",
    subheading: "Tiga langkah sederhana dari Google Maps ke GPX.",
    steps: [
      {
        step: "1",
        title: "Rencanakan rute Anda",
        description:
          "Buka Google Maps, buat rute perjalanan, lalu salin URL dari bilah alamat browser Anda.",
      },
      {
        step: "2",
        title: "Ubah ke GPX",
        description:
          "Tempel URL di atas dan klik Ubah ke GPX. Kami akan membuat file GPX dengan rute yang sama persis dari Google Maps.",
      },
      {
        step: "3",
        title: "Berangkat!",
        description:
          "Unduh file GPX dan impor ke Garmin Connect, Bryton Active, aplikasi Wahoo, atau perangkat yang kompatibel lainnya.",
      },
    ],
  },
  feedbackSection: {
    heading: "Bagikan Masukan Anda",
    subheading: "Menemukan bug atau punya ide? Beri tahu kami.",
  },
  donate: {
    heading: "Suka MapsToGPX? Belikan saya kopi!",
    description: "MapsToGPX gratis. Donasi membantu menutupi biaya Google Maps API.",
  },
  donateLinks: { venmo: "Venmo", paypal: "PayPal" },
  footer: {
    builtBy: "Dibuat oleh",
    faqLink: "FAQ",
    privacyLink: "Kebijakan Privasi",
    tagline: "Gratis selamanya. Dipercaya oleh pengguna di seluruh dunia.",
  },
  converterForm: {
    placeholder: "Tempel URL rute Google Maps Anda di sini...",
    convertButton: "Ubah ke GPX",
    convertingButton: "Memproses...",
    stepLabels: {
      idle: "",
      resolving: "Memproses URL pendek...",
      routing: "Mengonversi rute — ini mungkin memerlukan beberapa detik...",
      done: "Selesai!",
      error: "Kesalahan",
    },
    invalidUrlError: "Masukkan URL Google Maps yang valid",
    networkError: "Terjadi masalah jaringan. Silakan coba lagi.",
    nonJsonError: "Konversi gagal. Silakan coba lagi.",
    conversionFailedFallback: "Konversi gagal",
    successBanner: "Rute berhasil dikonversi!",
    distanceLabel: "Jarak",
    waypointsLabel: "Titik Rute",
    downloadButton: "Unduh GPX",
    newButton: "Baru",
  },
  feedbackForm: {
    ratingQuestion: "Bagaimana pengalaman Anda?",
    optionalHint: "(opsional)",
    ratingLabels: ["Buruk", "Cukup", "Baik", "Bagus", "Sangat Baik"],
    starAriaLabelOne: "{n} bintang",
    starAriaLabelMany: "{n} bintang",
    messageLabel: "Apa yang bisa ditingkatkan?",
    messageHint: "(bug, rute yang gagal dikonversi, ide fitur)",
    messagePlaceholder: "Ceritakan pendapat Anda...",
    emailLabel: "Email",
    emailHint: "(opsional, hanya jika Anda ingin dibalas)",
    emailPlaceholder: "you@example.com",
    sendButton: "Kirim Masukan",
    sendingButton: "Mengirim...",
    sendMoreButton: "Kirim masukan lagi",
    thanksHeading: "Terima kasih atas masukan Anda!",
    thanksSubtext: "Setiap pesan kami baca dan membantu membuat MapsToGPX lebih baik.",
    errorFallback: "Masukan gagal dikirim",
  },
  homeMeta: {
    title: "Konverter Rute Google Maps ke GPX",
    description:
      "Ubah URL rute Google Maps menjadi file GPX. Mendukung rute mengemudi, bersepeda, dan berjalan kaki. Gratis, tanpa perlu daftar.",
  },
  faqMeta: {
    title: "Pertanyaan umum",
    description:
      "Jawaban atas pertanyaan umum tentang mengonversi rute Google Maps menjadi file GPX: format URL yang didukung, mode perjalanan, isi file GPX, kompatibilitas perangkat, batasan, dan privasi.",
  },
  faqPage: {
    heading: "Pertanyaan yang Sering Diajukan",
    introPrefix: "Tidak menemukan jawaban Anda di sini? ",
    sendFeedbackLink: "Kirim masukan",
    introSuffix: ".",
    privacyNotePrefix: "Lihat ",
    privacyLinkText: "kebijakan privasi",
    privacyNoteSuffix: " untuk detail data apa yang diproses.",
    backButton: "← Kembali ke konverter",
    entries: [
      {
        question: "Format URL Google Maps apa yang didukung MapsToGPX?",
        answer:
          "URL rute panjang yang disalin dari address bar, tautan pendek (goo.gl dan maps.app.goo.gl — ini diperluas secara otomatis), URL yang dibuat dari alamat atau nama tempat, URL dengan koordinat lintang/bujur mentah, dan rute multi-titik dengan beberapa titik henti.",
      },
      {
        question:
          "Bagaimana sistem mengetahui mode perjalanan (mengemudi, bersepeda, berjalan kaki) yang digunakan?",
        answer:
          "Sistem membaca mode perjalanan yang sudah disertakan Google Maps dalam URL Anda — baik parameter travelmode maupun mode yang tersimpan saat Anda memilih mengemudi, bersepeda, berjalan kaki, atau transit di Maps. Jika tidak ada keduanya, mode default adalah mengemudi.",
      },
      {
        question: "Apa saja isi file GPX yang diunduh?",
        answer:
          "Satu track GPX 1.1 yang terdiri dari titik-titik track yang mengikuti jalur persis yang dikembalikan Google Directions, didekode pada tingkat langkah (step) untuk detail penuh (bukan garis overview Google yang disederhanakan). Ini adalah track, bukan rute atau daftar titik, dan tidak menyertakan data elevasi.",
      },
      {
        question: "Perangkat dan aplikasi apa yang dapat menggunakan file GPX?",
        answer:
          "Aplikasi atau perangkat GPS apa pun yang mendukung impor track GPX 1.1 standar — termasuk Garmin, Wahoo, Bryton, Hammerhead Karoo, dan perangkat COROS, di antara lainnya. Cukup impor atau salin file .gpx yang diunduh sama seperti track GPX lainnya.",
      },
      {
        question: "Apakah MapsToGPX gratis? Apakah saya perlu membuat akun?",
        answer:
          "Ya, sepenuhnya gratis, tanpa perlu akun, daftar, atau login. Tempel URL dan unduh file GPX Anda.",
      },
      {
        question:
          "Apakah mendukung rute multi-titik dan rute yang saya ubah bentuknya dengan menyeret?",
        answer:
          "Ya. Titik henti di tengah rute pada URL Anda dilalui secara berurutan — track melewati titik-titik tersebut tanpa ditambahkan sebagai marker titik terpisah — dan titik yang Anda seret ke rute di Google Maps disimpan sebagai via point yang membentuk jalur tanpa ditambahkan sebagai titik henti terpisah. Opsi \"hindari jalan raya/tol/feri\" yang Anda atur di Maps juga tetap terbawa.",
      },
      {
        question:
          "Mengapa rute hasil konversi bisa sedikit berbeda dari yang ditampilkan Google Maps?",
        answer:
          "Rute dihitung ulang oleh Google Directions API — mesin routing yang sama yang digunakan Google Maps — menggunakan titik-titik rute Anda, sehingga Google mungkin mengembalikan jalur yang sedikit berbeda jika data jalan atau routing berubah sejak Anda menyalin tautan, atau jika URL menyimpan rute alternatif yang tidak bisa diminta bersamaan dengan titik henti di tengah rute. Jika URL Anda mengarah ke rute alternatif tertentu dan perjalanan Anda memiliki titik henti di tengah, Google Directions API tidak dapat mengembalikan alternatif dalam kasus ini, sehingga rute utama digunakan sebagai gantinya dan sebuah peringatan ditampilkan.",
      },
      {
        question: "Apakah ada batasan ukuran rute atau seberapa sering saya bisa melakukan konversi?",
        answer:
          "Google Directions API mengizinkan maksimal 25 titik henti di tengah rute; rute dengan titik henti lebih banyak dari itu tidak bisa dikonversi. Jika Anda memiliki lebih sedikit titik henti tetapi banyak via point hasil seretan, via point tersebut akan dikurangi secara merata agar sesuai batas sementara setiap titik henti asli tetap dipertahankan. Konversi dan pencarian tautan pendek juga dibatasi hingga 10 permintaan per menit per alamat IP agar layanan tetap tersedia untuk semua orang.",
      },
      {
        question: "Konversi saya gagal — apa yang salah?",
        answer:
          "Penyebab paling umum adalah: tautan yang ditempel bukan URL rute Google Maps, alamat dalam rute tidak dapat di-geocode, Google Directions API tidak dapat menemukan rute antara titik yang diberikan, Anda mencapai batas permintaan per menit, atau ada masalah jaringan sementara. Coba salin ulang tautan dari Google Maps, sederhanakan rute, atau tunggu satu menit sebelum mencoba lagi.",
      },
      {
        question: "Bagaimana cara melaporkan bug atau mengusulkan fitur?",
        answer:
          "Gunakan formulir masukan di halaman utama — Anda dapat memberikan rating bintang, pesan, atau keduanya, dan opsional alamat email jika Anda ingin dibalas.",
      },
      {
        question: "Apakah MapsToGPX menyimpan rute atau data pribadi saya?",
        answer:
          "Tidak — rute, URL, dan alamat tidak disimpan dalam database; hanya cache berumur pendek yang digunakan untuk menghindari pencarian berulang. Lihat kebijakan privasi untuk detail lengkap tentang apa yang dikumpulkan dan tidak.",
      },
    ],
  },
  languageSwitcherLabel: "Bahasa",
};
