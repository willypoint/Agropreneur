import { SOPPhase, Commodity } from '../types';

export const SOP_COMMODITIES_MAP: Record<string, SOPPhase[]> = {
  'cabai-rawit-merah': [
    {
      week: 'Minggu -4 s/d -1',
      title: 'Persiapan Lahan & Persemaian Benih',
      description: 'Pengolahan tanah sedalam 30-40 cm, pemberian kapur dolomit bila pH < 6, dan penyemaian benih pada tray 200 lubang.',
      tasks: [
        { id: 'cr1', text: 'Cek pH tanah dengan pH meter (target ideal 6.0 - 6.8)' },
        { id: 'cr2', text: 'Tabur pupuk kandang matang terfermentasi 1.5 - 2 ton per 1000m²' },
        { id: 'cr3', text: 'Pasang mulsa plastik hitam perak (MPHP) saat matahari terik' },
        { id: 'cr4', text: 'Semai benih pada media cocopeat + kascing, tutup sungkup kain basah 48 jam' }
      ],
      tips: 'Tutup persemaian dengan insect net 50 mesh agar kutu kebul tidak menginfeksi bibit dengan virus kuning sejak dini.',
      keyInputs: 'Dolomit (150kg), Pupuk Kandang Kambing (80 sak), Mulsa Plastik (3 roll)'
    },
    {
      week: 'Minggu 1 - 4 (Fase Vegetatif)',
      title: 'Penanaman Bibit & Pemasangan Ajir',
      description: 'Pindah tanam saat bibit berdaun 4-5 helai (umur 21-25 hari semai). Dilakukan sore hari untuk mengurangi stres tanaman.',
      tasks: [
        { id: 'cr5', text: 'Kocor lubang tanam dengan larutan trichoderma & asam humat' },
        { id: 'cr6', text: 'Tancapkan ajir bambu 1.5 meter tegak lurus berjarak 7 cm dari pangkal' },
        { id: 'cr7', text: 'Kocoran pupuk NPK 16-16-16 dosis 3 gram per liter air seminggu sekali' },
        { id: 'cr8', text: 'Perempelan tunas air di bawah cabang Y pertama' }
      ],
      tips: 'Ikat batang tanaman ke ajir dengan tali rafia longgar berbentuk angka 8 agar batang leluasa membesar.',
      keyInputs: 'NPK Mutiara 16-16-16, Trichoderma SP, Asam Humat 85%'
    },
    {
      week: 'Minggu 5 - 10 (Fase Generatif / Bunga)',
      title: 'Pembentukan Bunga & Pencegahan Antraknosa',
      description: 'Peralihan nutrisi tinggi Fosfat (P) dan Kalium (K) untuk memperkuat tangkai bunga dan dinding sel buah.',
      tasks: [
        { id: 'cr9', text: 'Aplikasi pupuk MKP + KNO3 Putih + Kalsium Boron semprot/kocor' },
        { id: 'cr10', text: 'Pemasangan perangkap lalat buah (Methyl Eugenol) di tepi petak' },
        { id: 'cr11', text: 'Semprot fungisida protektif tembaga hidroksida menjelang mendung/hujan' },
        { id: 'cr12', text: 'Inspeksi rutin bawah daun terhadap tungau merah dan trips' }
      ],
      tips: 'Kalsium sangat krusial mencegah busuk pantat buah (blossom end rot) dan rontok bunga.',
      keyInputs: 'KNO3 Putih, MKP Pak Tani, Kalsium Boron, Insektisida Abamektin'
    },
    {
      week: 'Minggu 11 - 20 (Masa Panen Raya)',
      title: 'Pemetikan Berkala & Pascapanen',
      description: 'Pemetikan dilakukan setiap 5-7 hari sekali di pagi hari setelah embun kering. Petik bersama tangkainya.',
      tasks: [
        { id: 'cr13', text: 'Petik buah cabai saat warna kemerahan mencapai 85-95%' },
        { id: 'cr14', text: 'Pisahkan langsung cabai afkir/terserang lalat buah ke wadah terpisah' },
        { id: 'cr15', text: 'Kocorkan pupuk susulan NPK + Kalsium setelah setiap 2 kali pemetikan' },
        { id: 'cr16', text: 'Angin-anginkan cabai di tempat teduh beralas terpal sebelum masuk peti' }
      ],
      tips: 'Hindari memasukkan cabai basah ke dalam karung tertutup karena respirasi panas memicu pembusukan kilat.',
      keyInputs: 'Keranjang Panen Bersih, Pupuk Kocor Pemulih, Timbangan Gantung'
    }
  ],

  'pakcoy-hidroponik-nft': [
    {
      week: 'Minggu 1 (HST 1 - 7)',
      title: 'Semai Rockwool & Germinasi Benih',
      description: 'Potong rockwool ukuran 2.5 x 2.5 cm, basahi dengan air baku (PPM < 100), masukkan 1 biji per lubang.',
      tasks: [
        { id: 'p1', text: 'Simpan semaian di ruang gelap 24-36 jam hingga pecah benih' },
        { id: 'p2', text: 'Kenalkan sinar matahari pagi penuh saat kecambah muncul daun semu' },
        { id: 'p3', text: 'Beri nutrisi AB Mix 400 PPM pada hari ke-5 semai' }
      ],
      tips: 'Cegah etiolasi (kutilang/batang kurus tinggi) dengan segera menjemur bibit begitu sproat.',
      keyInputs: 'Benih Unggul Naibai, Rockwool Cultilene, Tray Semai'
    },
    {
      week: 'Minggu 2 (HST 8 - 14)',
      title: 'Pindah Tanam Meja Peremajaan NFT',
      description: 'Pindahkan bibit berdaun sejati 2 helai ke talang peremajaan dengan jarak tanam rapat (10 cm).',
      tasks: [
        { id: 'p4', text: 'Atur aliran nutrisi tipis (film) 1 - 2 liter per menit' },
        { id: 'p5', text: 'Naikkan kepekatan nutrisi AB Mix menjadi 800 PPM, pH 6.0' },
        { id: 'p6', text: 'Cek suhu tandon nutrisi harian (jaga di bawah 28°C)' }
      ],
      tips: 'Tandon nutrisi yang terik memicu busuk akar phytium; lindungi tandon dengan isolasi peredam panas.',
      keyInputs: 'Nutrisi AB Mix Sayur Daun, pH Down, TDS/EC Meter'
    },
    {
      week: 'Minggu 3 - 4 (HST 15 - 30)',
      title: 'Meja Pembesaran & Panen Segar',
      description: 'Pindah ke talang pembesaran (jarak 15-20 cm), naikkan nutrisi ke 1.100 - 1.200 PPM.',
      tasks: [
        { id: 'p7', text: 'Jaga kepekatan nutrisi 1.100 - 1.200 PPM hingga H-3 panen' },
        { id: 'p8', text: 'Flushing tandon dengan air bersih tanpa nutrisi 48 jam sebelum panen untuk membuang residu nitrat' },
        { id: 'p9', text: 'Panen cabut bersama akar utuh di pagi hari sejuk' },
        { id: 'p10', text: 'Sortasi daun kuning dan kemas dalam plastik mika ventilasi' }
      ],
      tips: 'Flushing air murni 2 hari sebelum panen membuat rasa daun jauh lebih manis dan renyah.',
      keyInputs: 'Plastik Kemasan OPP Berventilasi, Timbangan Digital'
    }
  ],

  'bawang-merah-brebes': [
    {
      week: 'Minggu -2 s/d 0',
      title: 'Olah Tanah Bedengan & Penyiapan Umbi Bibit',
      description: 'Pembuatan bedengan lebar 100-120 cm, parit drainase dalam 40-50 cm, pemotongan ujung umbi 1/3 bagian.',
      tasks: [
        { id: 'b1', text: 'Cangkul tanah gembur, tabur kapur dolomit 100 kg dan pupuk kandang matang' },
        { id: 'b2', text: 'Potong pucuk umbi bibit 1/3 bagian untuk merangsang serempaknya tunas' },
        { id: 'b3', text: 'Rendam bibit sebentar dalam larutan fungisida kontak Mankozeb' },
        { id: 'b4', text: 'Tanam dengan jarak 15 x 15 cm, benamkan umbi rata dengan permukaan tanah' }
      ],
      tips: 'Pemotongan ujung umbi wajib menggunakan pisau steril tajam agar tidak memicu busuk basah.',
      keyInputs: 'Umbi Bibit Bima Brebes (120kg), Pupuk Organik Kompos, Fungisida Mankozeb'
    },
    {
      week: 'Minggu 1 - 4 (HST 7 - 30)',
      title: 'Penyiraman Rutin Subuh & Pemupukan Susulan I',
      description: 'Fase kritis pertumbuhan anakan. Penyiraman wajib dilakukan setiap subuh untuk mencuci embun asam.',
      tasks: [
        { id: 'b5', text: 'Siram bedengan setiap jam 05.00 - 06.30 pagi untuk mencuci spora jamur embun upas' },
        { id: 'b6', text: 'Aplikasi pupuk susulan I pada 10-15 HST (Urea + ZA + NPK Mutiara)' },
        { id: 'b7', text: 'Pemasangan feromon ulat grayak (Spodoptera) di tengah petak sawah' },
        { id: 'b8', text: 'Pendangiran / penyiangan gulma di sela tanaman' }
      ],
      tips: 'Mencuci embun pagi adalah rahasia petani Brebes agar daun tidak menguning (moler/inul).',
      keyInputs: 'BBM Pompa Alkon, Pupuk NPK 16-16-16, Feromon Ulat'
    },
    {
      week: 'Minggu 5 - 8 (HST 35 - 60)',
      title: 'Pembesaran Umbi & Panen Kering Rogol',
      description: 'Aplikasi pupuk tinggi Kalium (KNO3 / KCl), penghentian air H-7 panen, panen cabut saat daun rebah 75%.',
      tasks: [
        { id: 'b9', text: 'Pupuk susulan II (KNO3 Putih + Kalium Sulfat ZK) untuk pembesaran dan pewarnaan umbi' },
        { id: 'b10', text: 'Keringkan parit bedengan pada H-7 sebelum cabut panen' },
        { id: 'b11', text: 'Panen cabut saat 70-80% daun rebah menguning dan leher umbi lunak' },
        { id: 'b12', text: 'Jemur pelayuan beralas daun di atas bedengan 2-3 hari, ikat rogol simpan di para-para' }
      ],
      tips: 'Jangan mencabut bawang saat mendung atau tanah basah karena umbi akan mudah busuk saat disimpan.',
      keyInputs: 'Pupuk Kalium ZK, Tali Bambu Pengikat Rogol, Terpal Penjemuran'
    }
  ],

  'melon-golden-greenhouse': [
    {
      week: 'Minggu -2 s/d 0',
      title: 'Sterilisasi Greenhouse & Pembibitan',
      description: 'Sterilisasi dinding greenhouse dengan kaporit/peroksida dan penyiapan media cocopeat steril dalam polybag.',
      tasks: [
        { id: 'm1', text: 'Cek kebocoran insect net dan sanitasi gulma sekeliling greenhouse' },
        { id: 'm2', text: 'Flushing instalasi selang drip dan kalibrasi debit emitter (1.5 - 2 L/jam)' },
        { id: 'm3', text: 'Semai benih pada rockwool dengan EC awal 0.8 mS/cm' },
        { id: 'm4', text: 'Pindah tanam saat bibit berumur 7-9 HST (muncul daun sejati ke-2)' }
      ],
      tips: 'Pastikan pH media tanam stabil di angka 5.8 - 6.2 sebelum benih masuk.',
      keyInputs: 'Benih F1 Inthanon, Rockwool Cultilene, Polybag 35x35cm, Cocopeat Low EC'
    },
    {
      week: 'Minggu 1 - 4 (Fase Vegetatif & Perambatan)',
      title: 'Lilit Batang, Pruning & Polinasi Buah',
      description: 'Melilitkan sulur tanaman ke tali gantung dan seleksi calon buah pada ruas daun ke-9 sampai ke-12.',
      tasks: [
        { id: 'm5', text: 'Lilit batang ke tali poliester searah jarum jam setiap 2 hari' },
        { id: 'm6', text: 'Buang semua tunas ketiak daun ruas 1 sampai 8' },
        { id: 'm7', text: 'Polinasi manual bunga betina pada jam 06.30 - 09.00 pagi' },
        { id: 'm8', text: 'Taikkan EC nutrisi bertahap dari 1.5 ke 2.2 mS/cm' }
      ],
      tips: 'Lakukan penyerbukan pada 2-3 bunga sekaligus, nanti setelah terbentuk pentil seukuran telur ayam pilih 1 buah paling simetris.',
      keyInputs: 'Tali Ajir UV, Nutrisi AB Mix Melon Fase Vegetatif, Sticky Yellow Trap'
    },
    {
      week: 'Minggu 5 - 9 (Fase Pembesaran Buah & Sweetening)',
      title: 'Gantung Buah, Pembentukan Net & Pematangan',
      description: 'Memasang pengait buah, menaikkan kalium untuk pembentukan gula alami (Brix), dan pengurangan air sebelum panen.',
      tasks: [
        { id: 'm9', text: 'Pasang tali pengikat tangkai buah ke kawat sling utama' },
        { id: 'm10', text: 'Jaga kelembapan udara relatif 65-75% saat pembentukan jaring (netting)' },
        { id: 'm11', text: 'Uji kadar kemanisan sample dengan refraktometer (target Brix ≥ 13.5)' },
        { id: 'm12', text: 'Turunkan volume penyiraman air 30% pada H-7 panen untuk mengentalkan gula' }
      ],
      tips: 'Daun bendera di dekat buah tidak boleh rontok karena merupakan pabrik fotosintesis penghasil sukrosa.',
      keyInputs: 'Nutrisi AB Mix Fase Buah (Tinggi K), Refraktometer Brix Digital, Net Buah'
    },
    {
      week: 'Minggu 10',
      title: 'Panen Selektif & Sortasi Kualitas',
      description: 'Pemanenan buah dengan memotong tangkai membentuk huruf T. Sortasi Grade A (1.3 - 1.8 kg).',
      tasks: [
        { id: 'm13', text: 'Potong tangkai buah dengan gunting tajam menyisakan cabang T' },
        { id: 'm14', text: 'Timbang bobot individu dan lap permukaan buah dengan kain mikrofiber' },
        { id: 'm15', text: 'Pasang foam jaring pelindung buah dan label brand usaha tani' },
        { id: 'm16', text: 'Kemas dalam master box ventilasi siap kirim ke supermarket mitra' }
      ],
      tips: 'Melon golden tidak boleh dibanting atau ditumpuk lebih dari 3 lapis agar rongga dalam tidak memar.',
      keyInputs: 'Gunting Stek Tajam, Foam Netting EPE, Box Karton Cetak Logo'
    }
  ],

  'tomat-servo-f1': [
    {
      week: 'Minggu -3 s/d 0',
      title: 'Persemaian & Pembuatan Bedengan Mulsa',
      description: 'Semai benih pada tray 105 lubang, olah tanah gembur dengan dolomit dan pupuk dasar kandang matang.',
      tasks: [
        { id: 't1', text: 'Semai benih Servo F1 pada media arang sekam + cocopeat steril' },
        { id: 't2', text: 'Buat bedengan tinggi 40 cm untuk mencegah genangan air akar' },
        { id: 't3', text: 'Pasang plastik mulsa perak dan buat lubang tanam jarak 50 x 60 cm' }
      ],
      tips: 'Semai di bawah naungan sungkup plastik UV agar benih terlindung dari guyuran hujan deras.',
      keyInputs: 'Benih Tomat Servo F1, Kapur Dolomit, Mulsa Plastik'
    },
    {
      week: 'Minggu 1 - 5 (Fase Pertumbuhan & Pasang Lanjaran)',
      title: 'Pemasangan Ajir Piramida & Pemangkasan Tunas',
      description: 'Pemasangan ajir bambu kokoh sistem silang piramida dan pemangkasan tunas liar bawah.',
      tasks: [
        { id: 't4', text: 'Tancap ajir bambu 1.8 meter sistem kerucut piramida tahan terpaan angin' },
        { id: 't5', text: 'Kocor NPK 16-16-16 dosis 4 gram/liter air interval 7 hari' },
        { id: 't6', text: 'Pruning tunas air di ketiak daun, sisakan 1-2 batang utama yang produktif' }
      ],
      tips: 'Ajir piramida silang jauh lebih kuat menopang bobot buah tomat yang lebat dibanding ajir tunggal.',
      keyInputs: 'Ajir Bambu 2 Meter, Tali Pengikat, Pupuk NPK'
    },
    {
      week: 'Minggu 6 - 12 (Fase Panen Berkala)',
      title: 'Pengendalian Ulat Buah & Panen Kematangan Mengkal',
      description: 'Pencegahan ulat bor Helicoverpa dan pemanenan buah tomat saat semburat oranye (fase breaker/turning).',
      tasks: [
        { id: 't7', text: 'Aplikasi Kalsium Boron semprot untuk mencegah busuk ujung buah (BER)' },
        { id: 't8', text: 'Panen buah saat warna mengkal 30-50% kemerahan untuk ketahanan kirim luar kota' },
        { id: 't9', text: 'Sortasi buah mulus bebas sengatan lalat buah dan simpan di peti kayu berventilasi' }
      ],
      tips: 'Panen tomat saat semburat jingga (bukan merah total) menjamin buah sampai di tangan pedagang pasar dalam kondisi prima.',
      keyInputs: 'Kalsium Boron Semprot, Peti Kayu / Keranjang Plastik'
    }
  ],

  'padi-sawah-irigasi': [
    {
      week: 'Minggu -3 s/d 0',
      title: 'Olah Lahan Sawah & Semai Dapog',
      description: 'Pembajakan tanah (luku I & II), penggaruan (glebeg) hingga macak-macak, persemaian sistem dapog.',
      tasks: [
        { id: 'pd1', text: 'Rendam gabah benih dalam air garam (pilih yang tenggelam bernas)' },
        { id: 'pd2', text: 'Semai benih pada bedengan sawah atau baki dapog selama 15-20 hari' },
        { id: 'pd3', text: 'Bajak sawah dan ratakan lumpur hingga halus merata' }
      ],
      tips: 'Gunakan sistem tanam Jajar Legowo 2:1 atau 4:1 untuk meningkatkan populasi rumpun dan efek border tanaman pinggir.',
      keyInputs: 'Benih Bersertifikat Inpari 32, Pupuk Organik Petroganik, Traktor Sawah'
    },
    {
      week: 'Minggu 1 - 7 (Fase Vegetatif & Anakan Maksimal)',
      title: 'Tanam Bibit Muda & Pengairan Berselang (Intermittent)',
      description: 'Tanam 1-2 bibit per lubang saat umur muda (15 HST), terapkan pengairan macak-macak.',
      tasks: [
        { id: 'pd4', text: 'Tanam pindah bibit muda kedalaman 1-2 cm (jangan terlalu dalam)' },
        { id: 'pd5', text: 'Pemupukan dasar Urea + NPK pada 7-10 HST' },
        { id: 'pd6', text: 'Pengendalian keong mas dan penyiangan rumput liar dengan alat gasrok' },
        { id: 'pd7', text: 'Pengairan berselang (keringkan sawah 3 hari, basahi 5 hari) untuk aerasi akar' }
      ],
      tips: 'Pengairan berselang merangsang akar padi tumbuh lebih dalam dan anakan produktif bertambah banyak.',
      keyInputs: 'Pupuk Urea, NPK Phonska, Molusisida Keong'
    },
    {
      week: 'Minggu 8 - 16 (Bunting, Pengisian Bulir & Panen)',
      title: 'Pengisian Bulir, Pengusiran Burung & Panen Sabit',
      description: 'Aplikasi kalium cair saat bunting keluar malai, pemasangan jaring burung, panen saat malai 90% menguning.',
      tasks: [
        { id: 'pd8', text: 'Semprot fungisida pencegah patah leher (blast) saat padi bunting keluar malai' },
        { id: 'pd9', text: 'Pasang jaring perangkap burung emprit di atas kanopi sawah' },
        { id: 'pd10', text: 'Keringkan total air sawah pada 10 hari sebelum panen' },
        { id: 'pd11', text: 'Panen dengan sabit bergerigi atau combine harvester saat kadar air 22-24%' }
      ],
      tips: 'Segera rontokkan gabah maksimal 24 jam setelah potong padi untuk menghindari gabah menguning dan apek.',
      keyInputs: 'Fungisida Blast Malai, Jaring Burung, Mesin Power Thresher'
    }
  ],

  'jagung-hibrida-pipil': [
    {
      week: 'Minggu 1 - 3 (HST 1 - 20)',
      title: 'Tugal Benih & Pemupukan Dasar',
      description: 'Tugal tanah sedalam 3-5 cm jarak 70 x 20 cm, masukkan 1 benih per lubang, tutup tanah remah.',
      tasks: [
        { id: 'j1', text: 'Tugal benih hibrida 1 butir per lubang tanam (populasi ~71.000 pohon/ha)' },
        { id: 'j2', text: 'Aplikasi insektisida butiran Karbofuran di dekat lubang pencegah lalat bibit' },
        { id: 'j3', text: 'Pemupukan susulan I pada 15 HST (Urea + NPK)' }
      ],
      tips: 'Gunakan benih hibrida bersertifikat dengan perlakuan benih (seed treatment) fungisida.',
      keyInputs: 'Benih Jagung Hibrida F1 (Pioneer/NK), Karbofuran Butiran, NPK'
    },
    {
      week: 'Minggu 4 - 8 (HST 25 - 60)',
      title: 'Pembumbunan Tanah & Pengendalian Ulat FAW',
      description: 'Menaikkan tanah ke pangkal batang (bumbun) dan pemupukan susulan II fase generatif.',
      tasks: [
        { id: 'j4', text: 'Bumbun tanah ke pangkal batang jagung agar tidak roboh diterpa angin kencang' },
        { id: 'j5', text: 'Inspeksi pucuk daun terhadap ulat grayak frugiperda (FAW)' },
        { id: 'j6', text: 'Pupuk susulan II pada 40 HST (Urea dosis tinggi)' }
      ],
      tips: 'Semprot insektisida tepat ke dalam corong pucuk daun tempat ulat grayak bersembunyi.',
      keyInputs: 'Pupuk Urea, Insektisida Emamektin Benzoat'
    },
    {
      week: 'Minggu 9 - 15 (HST 65 - 105)',
      title: 'Fase Pengisian Tongkol & Panen Klobot Kering',
      description: 'Pematangan biji jagung hingga terbentuk lapisan hitam (black layer) pada pangkal biji pipil.',
      tasks: [
        { id: 'j7', text: 'Potong daun atas (toping) pada 80 HST untuk mempercepat pengeringan tongkol di batang' },
        { id: 'j8', text: 'Panen tongkol saat klobot mengering kecokelatan dan biji mengkilap keras' },
        { id: 'j9', text: 'Pipil biji jagung dengan mesin pemipil dan jemur hingga kadar air 14%' }
      ],
      tips: 'Membiarkan klobot mengering alami di batang pohon (hanging dry) menghemat biaya penjemuran lantai terpal.',
      keyInputs: 'Karung Goni / Polypropylene, Mesin Pipil Jagung'
    }
  ],

  'kangkung-darat-cabut': [
    {
      week: 'Minggu 1 (HST 1 - 7)',
      title: 'Olah Bedengan & Tabur Benih Garitan',
      description: 'Buat bedengan halus, buat garitan dangkal berjarak 15-20 cm, tabur benih merata tipis.',
      tasks: [
        { id: 'kg1', text: 'Cangkul gembur bedengan, tabur pupuk kandang matang' },
        { id: 'kg2', text: 'Buat larikan/garitan sedalam 2 cm dan tabur benih rapat' },
        { id: 'kg3', text: 'Tutup dengan tanah halus tipis dan siram gembor halus pagi sore' }
      ],
      tips: 'Penyiraman 2 kali sehari di minggu pertama wajib dijaga agar perkecambahan serempak.',
      keyInputs: 'Benih Kangkung Serimpi, Pupuk Kandang, Gembor Siram'
    },
    {
      week: 'Minggu 2 - 4 (HST 8 - 25)',
      title: 'Pemupukan Cepat & Panen Cabut Akar',
      description: 'Kocor pupuk nitrogen tinggi, jaga gulma bersih, dan panen cabut pada umur 21-25 HST.',
      tasks: [
        { id: 'kg4', text: 'Kocor pupuk Urea atau NPK cair pada umur 10 HST' },
        { id: 'kg5', text: 'Panen cabut seluruh tanaman bersama akar saat tinggi mencapai 25-30 cm' },
        { id: 'kg6', text: 'Cuci akar dalam bak air bersih mengalir dan ikat per 250 gram' }
      ],
      tips: 'Cuci akar sampai putih bersih tanpa lumpur untuk menaikkan harga jual di pedagang sayur pasar pagi.',
      keyInputs: 'Pupuk Urea, Tali Bambu/Karet Pengikat, Bak Cuci Akar'
    }
  ]
};

/**
 * Intelligent helper: retrieves SOP for a commodity, or automatically generates
 * an agronomic template matching cycle days and characteristics.
 */
export function getSOPForCommodity(
  commodity: Commodity,
  customSOPs?: Record<string, SOPPhase[]>
): SOPPhase[] {
  // 1. Check custom user-edited SOP first
  if (customSOPs && customSOPs[commodity.id] && customSOPs[commodity.id].length > 0) {
    return customSOPs[commodity.id];
  }

  // 2. Check static predefined mapping
  if (SOP_COMMODITIES_MAP[commodity.id]) {
    return SOP_COMMODITIES_MAP[commodity.id];
  }

  // 3. Fallback: Generate intelligent tailored agronomic SOP template
  const cycle = commodity.cycleDays || 60;
  return [
    {
      week: 'Fase 1: Persiapan (Minggu -2 s/d 0)',
      title: `Persiapan Lahan & Media Tanam ${commodity.name}`,
      description: `Penyiapan tanah/media tanam sesuai ketinggian ${commodity.optimalAltitude} dan kebutuhan air ${commodity.waterRequirement}.`,
      tasks: [
        { id: `gen-${commodity.id}-1`, text: 'Pengecekan kesuburan tanah, aerasi, dan pemberian pupuk dasar organik' },
        { id: `gen-${commodity.id}-2`, text: 'Sterilisasi media tanam dan perlakuan benih unggul bersertifikat' },
        { id: `gen-${commodity.id}-3`, text: 'Pemasangan sarana irigasi tetes/gembor dan penataan jalur parit' }
      ],
      tips: `Perhatikan tingkat kebutuhan air ${commodity.waterRequirement} untuk mencegah stres tanaman di awal tanam.`,
      keyInputs: 'Pupuk Kandang/Kompos Matang, Benih Bersertifikat, Alat Kerja Tani'
    },
    {
      week: `Fase 2: Vegetatif Awal (Hari 1 s/d ${Math.round(cycle * 0.4)})`,
      title: `Pertumbuhan Daun, Batang & Akar ${commodity.name}`,
      description: 'Fase percepatan pembentukan struktur vegetatif dan penguatan sistem perakaran tanaman.',
      tasks: [
        { id: `gen-${commodity.id}-4`, text: 'Pindah tanam bibit di sore hari dan penyiraman berkala' },
        { id: `gen-${commodity.id}-5`, text: 'Aplikasi pupuk susulan nitrogen dan fosfat berimbang' },
        { id: `gen-${commodity.id}-6`, text: 'Inspeksi pencegahan hama dan gulma secara mekanik atau hayati' }
      ],
      tips: 'Jaga kelembapan tanah stabil dan lakukan penyiangan gulma sebelum gulma berbunga.',
      keyInputs: 'Pupuk NPK Formula Vegetatif, Bio-Pestisida, Gembor/Selang Air'
    },
    {
      week: `Fase 3: Generatif & Pematangan (Hari ${Math.round(cycle * 0.41)} s/d ${Math.round(cycle * 0.85)})`,
      title: `Pembentukan Bunga, Buah atau Umbi`,
      description: 'Peralihan nutrisi ke unsur Kalium untuk merangsang pengisian bobot dan kualitas hasil panen.',
      tasks: [
        { id: `gen-${commodity.id}-7`, text: 'Aplikasi pupuk tinggi Kalium untuk memaksimalkan bobot dan rasa' },
        { id: `gen-${commodity.id}-8`, text: 'Pengendalian hama penyakit terpadu (PHT) secara teratur' },
        { id: `gen-${commodity.id}-9`, text: 'Penyangga fisik tanaman (ajir/tali gantung bila merambat)' }
      ],
      tips: 'Hindari pemupukan nitrogen berlebih di fase generatif karena memicu rontok bunga dan jamur.',
      keyInputs: 'Pupuk Kalium (KNO3 / KCl), Perangkap Hama Fisik'
    },
    {
      week: `Fase 4: Panen & Pascapanen (Hari ${Math.round(cycle * 0.86)} s/d ${cycle})`,
      title: `Pemanenan Standar Mutu & Distribusi Pasar`,
      description: `Pemanenan saat komoditas mencapai kriteria matang optimal dan penanganan pascapanen sesuai target pasar ${commodity.targetMarkets.slice(0, 2).join(', ')}.`,
      tasks: [
        { id: `gen-${commodity.id}-10`, text: 'Pemanenan di waktu sejuk pagi hari dengan alat panen bersih' },
        { id: `gen-${commodity.id}-11`, text: 'Sortasi grade mutu A/B/C dan pembersihan kotoran fisik' },
        { id: `gen-${commodity.id}-12`, text: 'Pengemasan berventilasi dan pengiriman kilat ke saluran penjualan' }
      ],
      tips: 'Pascapanen yang higienis dan pendinginan cepat memperpanjang masa simpan hingga 40%.',
      keyInputs: 'Keranjang Panen, Timbangan Terkalibrasi, Kemasan Bersih'
    }
  ];
}
