import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Topic } from '../../../types/curriculum';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Award,
  ArrowRight,
  School,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  EyeOff
} from 'lucide-react';
import { shuffleScenarioItem } from '../../../utils/questionRandomizer';

interface ScenarioChallengeProps {
  topic: Topic;
}

export const ScenarioChallengeSimulation: React.FC<ScenarioChallengeProps> = ({ topic }) => {
  const { playClick, playSuccess, playError, playFanfare } = useTheme();

  // Generate dynamic contextual scenarios based on topic category / title
  const getScenarios = () => {
    const t = topic.title.toLowerCase();

    if (t.includes('informasi digital') || t.includes('kredibilitas') || t.includes('fakta')) {
      return [
        {
          id: 1,
          title: 'Tugas Makalah IPA di Perpustakaan',
          story: 'Rizky sedang mencari materi tentang "Daur Hidup Kupu-Kupu". Hasil pencarian nomor satu berasal dari blog pribadi anonim tanpa sumber rujukan ilmiah, sedangkan hasil nomor tiga berasal dari Rumah Belajar Kemdikbud.',
          question: 'Apa langkah paling bijak yang harus diambil Rizky agar tugasnya mendapat nilai maksimal?',
          options: [
            { text: 'Memilih rujukan dari Rumah Belajar Kemdikbud karena disusun oleh ahli pendidikan dan terpercaya', isCorrect: true, reason: 'Tepat sekali! Memilih portal resmi menjamin kebenaran materi tugas.' },
            { text: 'Langsung menyalin artikel blog anonim karena berada di urutan teratas', isCorrect: false, reason: 'Urutan teratas tidak selalu berarti paling terpercaya; bisa saja karena trik SEO.' },
            { text: 'Menyerah dan tidak mengerjakan tugas', isCorrect: false, reason: 'Selalu ada solusi literasi yang bisa dipelajari!' }
          ]
        },
        {
          id: 2,
          title: 'Pesan Berantai WhatsApp di Grup Kelas',
          story: 'Di grup kelas 7 SMPN 5 Kroya, seorang teman membagikan link: "Klik di sini untuk klaim pulsa 100 ribu dari pemerintah!". Tautan tersebut berakhiran .xyz dan meminta nomor HP.',
          question: 'Sikap apa yang mencerminkan kecakapan digital siswa berkarakter?',
          options: [
            { text: 'Mengingatkan teman-teman agar tidak mengeklik link tersebut karena itu adalah penipuan (phishing)', isCorrect: true, reason: 'Luar biasa! Melindungi teman dari bahaya penipuan digital adalah sikap terpuji.' },
            { text: 'Ikut membagikan link tersebut ke keluarga agar semua dapat pulsa', isCorrect: false, reason: 'Tautan berbahaya bisa menyebarkan malware dan membobol data orang lain.' },
            { text: 'Memasukkan nomor rekening orang tua', isCorrect: false, reason: 'Sangat berbahaya dan bisa memicu pencurian data rahasia.' }
          ]
        },
        {
          id: 3,
          title: 'Memasukkan Sumber Sitasi pada Laporan',
          story: 'Nisa selesai mengetik artikel tugas Informatika. Temannya menyarankan untuk hanya menulis "Sumber: Google" di daftar pustaka.',
          question: 'Bagaimana tanggapan yang benar sesuai kaidah etika digital?',
          options: [
            { text: 'Google adalah mesin pencari, kita harus mencantumkan nama penulis dan situs asli pembuat artikel', isCorrect: true, reason: 'Benar! Google bukan pembuat tulisan, melainkan hanya mesin perantara.' },
            { text: 'Menyetujui saran teman karena menulis nama situs asli terlalu panjang', isCorrect: false, reason: 'Tidak mencantumkan sumber asli melanggar etika hak cipta karya orang lain.' },
            { text: 'Tidak usah mencantumkan sumber sama sekali', isCorrect: false, reason: 'Setiap karya rujukan wajib dicantumkan sumbernya secara jujur.' }
          ]
        }
      ];
    }

    if (t.includes('ruang publik virtual') || topic.id === 'k9-ruang-publik-virtual') {
      return [
        {
          id: 1,
          category: 'Mindfulness & Berpikir Sebelum Posting',
          title: 'Menerima Informasi Menghebohkan di Grup Kelas',
          story: 'Di grup chat kelas 9, seorang teman membagikan kabar dramatis tanpa sumber resmi: "Mulai besok jam masuk sekolah dimajukan ke pukul 05.00 pagi oleh dinas!". Pesan tersebut disertai ajakan untuk memprotes di media sosial.',
          question: 'Bagaimana penerapan mindfulness digital yang paling tepat?',
          options: [
            { text: 'Berpikir kritis (Think Before You Post), menenangkan teman sekelas, dan memvalidasi kebenaran informasi ke wali kelas atau situs resmi sekolah', isCorrect: true, reason: 'Tepat sekali! Mindfulness digital melatih kita untuk tidak langsung bereaksi emosional terhadap kabar yang belum jelas kebenarannya.' },
            { text: 'Langsung membagikan ulang pesan tersebut ke semua akun media sosial dengan kata-kata provokatif', isCorrect: false, reason: 'Tindakan gegabah yang dapat memicu kepanikan massal dan menyebarkan hoaks.' },
            { text: 'Mengetik komentar kasar dengan huruf kapital di status WhatsApp', isCorrect: false, reason: 'Penggunaan huruf kapital berlebihan dianggap berteriak dengan emosi tidak sopan.' }
          ]
        },
        {
          id: 2,
          category: 'Toleransi & Empati Digital',
          title: 'Menyikapi Perbedaan Pendapat di Kolom Diskusi',
          story: 'Dalam forum diskusi tugas online, seorang teman menyampaikan sudut pandang yang berbeda tentang topik proyek. Teman lain mulai mencemooh dan melontarkan lelucon yang mengarah ke perundungan siber (cyberbullying).',
          question: 'Sikap apa yang mencerminkan empati dan toleransi digital siswa berkarakter?',
          options: [
            { text: 'Mengingatkan teman-teman dengan santun untuk menghargai perbedaan pendapat dan memberikan dukungan positif kepada teman yang dicemooh', isCorrect: true, reason: 'Luar biasa! Empati digital membuat kita peka terhadap perasaan orang lain dan berani membela teman dari perundungan siber.' },
            { text: 'Ikut menertawakan dan menambahkan komentar ejekan agar terlihat akrab dengan teman lain', isCorrect: false, reason: 'Sikap tidak terpuji yang melanggar etika digital dan menyakiti perasaan teman.' },
            { text: 'Langsung mematikan laptop dan tidak peduli dengan situasi yang terjadi', isCorrect: false, reason: 'Sikap apatis tidak membantu menciptakan lingkungan ruang publik virtual yang aman.' }
          ]
        },
        {
          id: 3,
          category: 'Etika Berkomunikasi dengan Guru',
          title: 'Konfirmasi Pengumpulan Tugas Kelompok kepada Guru',
          story: 'Bagas ingin menanyakan batas waktu pengumpulan tugas Informatika kepada Bapak Guru melalui aplikasi pesan singkat di ponselnya.',
          question: 'Format pesan manakah yang paling mencerminkan tata krama etika digital yang baik?',
          options: [
            { text: 'Mengawali dengan salam hormat, memperkenalkan nama dan kelas, menyampaikan pertanyaan dengan bahasa sopan pada jam kerja wajar, lalu berterima kasih', isCorrect: true, reason: 'Sangat santun! Etika netiket mengharuskan salam, kejelasan identitas siswa, serta bahasa hormat saat menghubungi pendidik.' },
            { text: 'Mengirimkan pesan "P" sepuluh kali berturut-turut pada jam 11 malam', isCorrect: false, reason: 'Sangat tidak sopan dan mengganggu waktu istirahat guru.' },
            { text: 'Langsung bertanya tanpa salam dengan singkatan gaul yang sulit dipahami', isCorrect: false, reason: 'Kurang menghargai guru dan berpotensi menimbulkan kesalahpahaman komunikasi.' }
          ]
        },
        {
          id: 4,
          category: 'Kolaborasi Digital Efektif',
          title: 'Mengelola Kerja Bersama di Google Workspace',
          story: 'Kelompok 3 beranggotakan 4 siswa dengan tempat tinggal saling berjauhan sedang menyusun naskah tugas di Google Docs.',
          question: 'Strategi kolaborasi manakah yang menjamin tugas selesai tepat waktu dan adil?',
          options: [
            { text: 'Menyepakati pembagian bab tugas yang jelas, saling mengoreksi melalui mode saran (suggesting), serta menjaga komunikasi rutin', isCorrect: true, reason: 'Kunci kolaborasi digital sukses adalah tujuan bersama, pembagian kerja adil, dan komunikasi teratur.' },
            { text: 'Membebankan seluruh pengetikan dan pencarian materi hanya kepada ketua kelompok', isCorrect: false, reason: 'Tidak adil dan bertentangan dengan prinsip kerja sama tim.' },
            { text: 'Menghapus ketikan teman tanpa berdiskusi terlebih dahulu', isCorrect: false, reason: 'Menimbulkan konflik antaranggot kelompok dan merusak kerja sama.' }
          ]
        }
      ];
    }

    if (t.includes('keamanan') || t.includes('siber') || t.includes('password') || topic.id === 'k9-keamanan-digital') {
      return [
        {
          id: 1,
          category: 'Malware & Trojan WhatsApp',
          title: 'Kasus Kiriman Undangan Pernikahan .APK di WhatsApp',
          story: 'Fajar, siswa kelas 9 SMPN 5 Kroya, menerima pesan WhatsApp dari nomor tak dikenal yang mengaku kurir paket. Pesan tersebut bertuliskan "Paket Anda tertahan di kantor pos, silakan cek foto resi di aplikasi ini" disertai lampiran file bernama "Lihat_Foto_Resi.apk".',
          question: 'Apa tindakan paling bijak dan aman yang harus diambil Fajar sesuai prinsip Keamanan Siber?',
          options: [
            { text: 'Segera blokir nomor pengirim dan hapus file tersebut tanpa pernah mengeklik atau menginstalnya', isCorrect: true, reason: 'Tepat sekali! File .APK dari sumber tak resmi adalah malware (Trojan) berbahaya yang mampu mencuri SMS verifikasi (OTP) dan menguras data akun pengguna.' },
            { text: 'Mengunduh dan memasang aplikasi karena penasaran paket apa yang tertahan', isCorrect: false, reason: 'Sangat berbahaya! Menginstal file .apk liar akan memberikan izin akses penuh bagi penyusup untuk membaca SMS, kontak, dan merekam ketikan layar (keylogger).' },
            { text: 'Meneruskan (forward) pesan tersebut ke grup kelas agar teman-teman ikut membantu membuka', isCorrect: false, reason: 'Menyebarkan file malware akan membahayakan perangkat seluruh teman di grup kelas.' }
          ]
        },
        {
          id: 2,
          category: 'Phishing Akun Belajar & Google Classroom',
          title: 'Kasus Email Verifikasi Akun Palsu (Phishing)',
          story: 'Dinda menerima email yang mengatasnamakan Tim Admin Sekolah dengan judul darurat: "Akun Google Belajar Anda Akan Ditutup Dalam 24 Jam! Segera Verifikasi". Email tersebut menyertakan tombol login ke alamat URL "smpn5kroya-verifikasi.free-domain.xyz".',
          question: 'Bagaimana analisis Dinda untuk memastikan keaslian email dan menjaga keamanan akun belajarnya?',
          options: [
            { text: 'Waspadai domain tiruan (.xyz), jangan memasukkan password, dan laporkan email mencurigakan ini kepada guru Informatika/Admin sekolah', isCorrect: true, reason: 'Luar biasa! Ini adalah modus serangan Phishing. Sekolah resmi menggunakan domain web resmi (.sch.id), bukan domain gratisan (.xyz). Admin resmi juga tidak pernah meminta login dadakan lewat tautan liar.' },
            { text: 'Segera memasukkan username dan password agar akun belajarnya tidak dinonaktifkan', isCorrect: false, reason: 'Bencana siber! Memasukkan kredensial pada situs tiruan akan langsung mengirimkan kata sandimu ke tangan peretas.' },
            { text: 'Mengganti password akun belajar dengan angka 123456', isCorrect: false, reason: 'Menggunakan password yang terlalu lemah mempermudah hacker membobol akunmu.' }
          ]
        },
        {
          id: 3,
          category: 'Privasi Komputer Bersama & Lab Sekolah',
          title: 'Kasus Menggunakan Komputer Bersama di Laboratorium / Warnet',
          story: 'Setelah selesai mengerjakan tugas kelompok Informatika di PC Laboratorium Sekolah, bel istirahat berbunyi. Teman-temannya terburu-buru keluar ruangan menuju kantin.',
          question: 'Prosedur keamanan digital apa yang WAJIB diselesaikan sebelum meninggalkan komputer lab?',
          options: [
            { text: 'Melakukan tombol "Log Out / Keluar" dari semua akun, menghapus centang simpan password, serta menutup jendela peramban (browser)', isCorrect: true, reason: 'Sangat tepat! Jika tidak logout, siswa kelas berikutnya bisa langsung mengakses email, drive tugas, hingga akun medsosmu tanpa perlu memasukkan password.' },
            { text: 'Cukup mematikan layar monitor saja sementara akun Google masih dalam posisi login', isCorrect: false, reason: 'Salah besar! Mematikan monitor tidak mengeluarkan sesi akun. Siapapun yang menyalakan monitor kembali bisa membuka akunmu.' },
            { text: 'Menyimpan password di browser (klik "Save Password") agar mudah dipakai lagi besok', isCorrect: false, reason: 'Sangat fatal! Menyimpan kata sandi di komputer umum membuka akses bagi siapa saja untuk menggunakan akunmu.' }
          ]
        },
        {
          id: 4,
          category: 'Data Pribadi Spesifik & UU PDP',
          title: 'Kasus Pengunggahan Dokumen Resmi Keluarga ke Media Sosial',
          story: 'Seorang teman merasa bangga baru saja menerima Kartu Identitas Anak (KIA) dan Kartu Keluarga (KK) baru. Ia berniat memotret dokumen tersebut secara jelas lalu menjadikannya status WhatsApp dan postingan Instagram Story.',
          question: 'Mengapa tindakan tersebut sangat berbahaya dan bertentangan dengan UU Perlindungan Data Pribadi?',
          options: [
            { text: 'NIK, nomor KK, dan nama ibu kandung adalah data pribadi spesifik yang bisa disalahgunakan untuk pinjaman online ilegal, penipuan, atau pemalsuan identitas', isCorrect: true, reason: 'Pintar sekali! Sesuai UU PDP No. 27 Tahun 2022, data spesifik seperti NIK dan nama ibu kandung bersifat sangat rahasia dan wajib dilindungi dari ruang publik.' },
            { text: 'Boleh diunggah asalkan menggunakan filter warna estetik', isCorrect: false, reason: 'Filter visual tidak menyamarkan nomor NIK dan data sensitif yang bisa dibaca sindikat kejahatan siber.' },
            { text: 'Tidak berbahaya sama sekali karena semua orang di internet adalah teman baik', isCorrect: false, reason: 'Dunia internet dipenuhi peretas dan pihak jahat yang mengincar kebocoran data untuk kejahatan finansial.' }
          ]
        },
        {
          id: 5,
          category: 'Rekayasa Sosial & Kerahasiaan Kode OTP',
          title: 'Kasus Panggilan Telepon Berkedok Petugas Hadiah (Social Engineering)',
          story: 'Hp berdering dari nomor telepon seluler asing. Penelpon dengan nada ramah mengucapkan selamat atas hadiah pulsa 1 juta rupiah dan meminta: "Kami sudah mengirim kode 6 digit verifikasi ke SMS adik, tolong sebutkan angkanya sekarang ya agar hadiahnya cair".',
          question: 'Bagaimana respon cerdas seorang siswa yang memiliki literasi keamanan digital tinggi?',
          options: [
            { text: 'Menolak dengan tegas, segera memutus panggilan, dan tidak pernah memberikan kode OTP SMS kepada siapapun', isCorrect: true, reason: 'Hebat! Kode OTP (One-Time Password) adalah kunci otentikasi ganda rahasia. Petugas resmi dari bank/layanan manapun TIDAK AKAN PERNAH meminta kode OTP kepada pelanggan.' },
            { text: 'Segera menyebutkan 6 angka tersebut karena penelpon terdengar sangat ramah dan sopan', isCorrect: false, reason: 'Tertipu rekayasa sosial! Kode OTP tersebut adalah kode verifikasi untuk meretas akun WhatsApp atau dompet digitalmu.' },
            { text: 'Menuliskan kode tersebut di buku catatan sekolah', isCorrect: false, reason: 'Solusi yang tidak relevan dan tetap mengabaikan bahaya peretasan yang sedang terjadi.' }
          ]
        }
      ];
    }

    if (t.includes('jaringan') || t.includes('koneksi')) {
      return [
        {
          id: 1,
          title: 'Praktikum ANBK di Laboratorium Komputer',
          story: 'Saat ujian berlangsung, komputer PC Siswa 05 tiba-tiba tidak bisa memuat soal, sedangkan 29 komputer lainnya lancar tanpa gangguan.',
          question: 'Pemeriksaan fisik pertama yang paling tepat dilakukan sesuai konsep topologi Star adalah...',
          options: [
            { text: 'Memeriksa apakah kabel LAN RJ45 di belakang PC Siswa 05 terpasang rapat dan lampu port menyala', isCorrect: true, reason: 'Tepat! Pada topologi Star, gangguan lokal biasanya terjadi pada kabel node yang bersangkutan.' },
            { text: 'Mematikan saklar listrik utama seluruh sekolah', isCorrect: false, reason: 'Tindakan gegabah yang merugikan semua siswa lain.' },
            { text: 'Membongkar casing switch pusat', isCorrect: false, reason: 'Switch berfungsi normal karena 29 komputer lain tidak bermasalah.' }
          ]
        },
        {
          id: 2,
          title: 'Memilih Koneksi untuk Presentasi di Depan Kelas',
          story: 'Kelompok 2 ingin menampilkan video tugas dari HP ke Smart TV / Layar Sentuh IFP kelas.',
          question: 'Teknologi nirkabel manakah yang paling praktis digunakan tanpa mencolok kabel?',
          options: [
            { text: 'Menggunakan Screen Mirroring melalui koneksi Wi-Fi yang sama dengan IFP', isCorrect: true, reason: 'Sangat praktis! Screen Mirroring memancarkan tampilan layar ponsel ke IFP secara nirkabel.' },
            { text: 'Memotong kabel listrik TV', isCorrect: false, reason: 'Tindakan berbahaya yang dilarang di sekolah!' },
            { text: 'Menggunakan kabel tali rafia', isCorrect: false, reason: 'Tali rafia bukan media transmisi data digital.' }
          ]
        }
      ];
    }

    // Default universal scenarios for other topics
    return [
      {
        id: 1,
        title: 'Kerja Kelompok Proyek Informatika di SMPN 5 Kroya',
        story: `Tim siswa sedang menyelesaikan proyek tugas materi "${topic.title}". Mereka memiliki waktu 3 hari sebelum batas pengumpulan.`,
        question: 'Langkah computational thinking manakah yang paling efektif untuk memulai kerja kelompok?',
        options: [
          { text: 'Dekomposisi: membagi tugas menjadi riset materi, perancangan slide, dan pengetikan laporan', isCorrect: true, reason: 'Bagus sekali! Memecah tugas besar membuat pekerjaan selesai lebih cepat dan merata.' },
          { text: 'Menyerahkan semua beban kerja ke satu ketua kelompok saja', isCorrect: false, reason: 'Kerja kelompok harus didasari kolaborasi dan gotong royong.' },
          { text: 'Menunda pekerjaan sampai menit terakhir sebelum pengumpulan', isCorrect: false, reason: 'Menunda tugas menyebabkan hasil tidak maksimal dan terburu-buru.' }
        ]
      },
      {
        id: 2,
        title: 'Menghadapi Error saat Mengoperasikan Aplikasi',
        story: 'Saat menjalankan aplikasi pembelajaran, muncul pesan peringatan dan program tidak berjalan sesuai harapan.',
        question: 'Tindakan apa yang mencerminkan pemecahan masalah (debugging) yang tepat?',
        options: [
          { text: 'Membaca pesan peringatan dengan tenang, lalu memeriksa kembali langkah instruksi yang terlewat', isCorrect: true, reason: 'Sikap tenang dan analitis adalah ciri utama siswa melek teknologi.' },
          { text: 'Memukul keyboard dan mematikan laptop secara paksa', isCorrect: false, reason: 'Dapat merusak perangkat keras dan menghilangkan data yang belum tersimpan.' },
          { text: 'Menyalahkan teman sebangku', isCorrect: false, reason: 'Kesalahan logika program harus diselesaikan secara rasional.' }
        ]
      }
    ];
  };

  const scenarios = getScenarios().map((s) => shuffleScenarioItem(s, topic.id));
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const currentScenario = scenarios[selectedScenarioIdx];
  const selectedOptionIdx = userAnswers[selectedScenarioIdx];
  const isAnswered = selectedOptionIdx !== undefined;

  const handleSelectOption = (idx: number) => {
    playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [selectedScenarioIdx]: idx
    }));

    if (currentScenario.options[idx].isCorrect) {
      playFanfare();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } else {
      playError();
    }
  };

  const handleReset = () => {
    playClick();
    setUserAnswers({});
    setSelectedScenarioIdx(0);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner */}
      <div className={`p-5 sm:p-6 rounded-3xl text-white shadow-xl space-y-2 transition-all ${
        topic.id === 'k9-ruang-publik-virtual' || topic.title.toLowerCase().includes('ruang publik')
          ? 'bg-linear-to-r from-purple-700 via-indigo-600 to-sky-700'
          : topic.id === 'k9-keamanan-digital' || topic.title.toLowerCase().includes('keamanan')
          ? 'bg-linear-to-r from-red-600 via-rose-600 to-indigo-800'
          : 'bg-linear-to-r from-amber-600 to-orange-700'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
          {topic.id === 'k9-ruang-publik-virtual' ? (
            <Sparkles className="w-4 h-4 text-purple-200" />
          ) : topic.id === 'k9-keamanan-digital' ? (
            <ShieldAlert className="w-4 h-4 text-rose-200" />
          ) : (
            <School className="w-4 h-4 text-amber-200" />
          )}
          <span className={topic.id === 'k9-ruang-publik-virtual' ? 'text-purple-200' : topic.id === 'k9-keamanan-digital' ? 'text-rose-200' : 'text-amber-200'}>
            {topic.id === 'k9-ruang-publik-virtual'
              ? 'Simulasi Pengambilan Keputusan: Etika & Mindfulness Ruang Publik Virtual'
              : topic.id === 'k9-keamanan-digital'
              ? 'Simulasi Studi Kasus Sehari-Hari: Keamanan Digital & Kejahatan Siber'
              : 'Simulasi Studi Kasus Sehari-Hari SMP Negeri 5 Kroya'}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          {topic.id === 'k9-ruang-publik-virtual'
            ? 'Tantangan Interaksi & Kolaborasi Digital Siswa Kelas 9'
            : topic.id === 'k9-keamanan-digital'
            ? 'Tantangan Detektif Keamanan Siber: Lindungi Privasi & Cegah Pembobolan'
            : 'Tantangan Pengambilan Keputusan Cerdas Siswa Digital'}
        </h2>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
          {topic.id === 'k9-ruang-publik-virtual'
            ? 'Pecahkan 4 skenario nyata di dunia maya: menghadapi kabar heboh di grup chat, menyikapi perbedaan pendapat dengan toleransi & empati, etika berkirim pesan kepada guru, serta kolaborasi tugas kelompok di cloud!'
            : topic.id === 'k9-keamanan-digital'
            ? 'Pecahkan 5 kasus nyata kejahatan siber yang marak dihadapi siswa: file .APK palsu, email phishing, pencurian password di lab, kebocoran NIK/KK, dan peretasan OTP!'
            : 'Hadapi situasi nyata yang sering terjadi di sekolah, lab komputer, dan lingkungan belajarmu. Pilih tindakan terbaik dan lihat konsekuensi logis dari setiap keputusan!'}
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {scenarios.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                playClick();
                setSelectedScenarioIdx(idx);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                selectedScenarioIdx === idx
                  ? topic.id === 'k9-keamanan-digital'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Kasus #{idx + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Kasus</span>
        </button>
      </div>

      {/* Active Scenario Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              topic.id === 'k9-keamanan-digital'
                ? 'bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-800 dark:text-rose-300'
                : 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 text-amber-800 dark:text-amber-300'
            }`}>
              {topic.id === 'k9-keamanan-digital' ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <Lightbulb className="w-3.5 h-3.5" />
              )}
              <span>Studi Kasus Kontekstual #{selectedScenarioIdx + 1}</span>
            </div>

            {'category' in currentScenario && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {(currentScenario as any).category}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {currentScenario.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            {currentScenario.story}
          </p>
        </div>

        {/* Question & Choices */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
            {currentScenario.question}
          </h4>

          <div className="space-y-2.5">
            {currentScenario.options.map((opt, idx) => {
              const isSelected = selectedOptionIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all active:scale-98 space-y-1.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 ring-4 ring-emerald-500/20'
                        : 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100 ring-4 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-400 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 text-xs sm:text-sm font-bold">
                    <span>{opt.text}</span>
                    {isSelected && (
                      <span className="shrink-0 font-bold">
                        {opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                        )}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div
                      className={`text-xs p-2.5 rounded-xl ${
                        opt.isCorrect
                          ? 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                          : 'bg-rose-100/80 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200'
                      }`}
                    >
                      {opt.reason}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
