import { MarketPriceItem } from '../types';

export const MARKET_PRICES: MarketPriceItem[] = [
  {
    id: 'mp-cabai-rawit',
    commodityName: 'Cabai Rawit Merah',
    category: 'Hortikultura Sayur',
    currentPrice: 42500,
    previousPrice: 39000,
    changePct: 8.97,
    unit: 'Kg',
    region: 'Pasar Induk Kramat Jati & Sentra Kediri',
    trend: 'up',
    history7Days: [37000, 38500, 38000, 39000, 40500, 41000, 42500],
    highestRegion: 'DKI Jakarta (Rp 55.000/kg)',
    lowestRegion: 'Jawa Timur Petani (Rp 32.000/kg)'
  },
  {
    id: 'mp-bawang-merah',
    commodityName: 'Bawang Merah Super',
    category: 'Hortikultura Sayur',
    currentPrice: 34000,
    previousPrice: 35500,
    changePct: -4.22,
    unit: 'Kg',
    region: 'Sentra Brebes & Nganjuk',
    trend: 'down',
    history7Days: [36000, 36000, 35500, 35000, 34500, 34200, 34000],
    highestRegion: 'Kalimantan Timur (Rp 45.000/kg)',
    lowestRegion: 'Brebes Gudang (Rp 26.000/kg)'
  },
  {
    id: 'mp-melon-golden',
    commodityName: 'Melon Golden Hidroponik',
    category: 'Buah Premium',
    currentPrice: 28500,
    previousPrice: 28000,
    changePct: 1.78,
    unit: 'Kg',
    region: 'Modern Market Jabodetabek & Surabaya',
    trend: 'stable',
    history7Days: [28000, 28000, 28000, 28500, 28500, 28500, 28500],
    highestRegion: 'Supermarket Bali (Rp 36.000/kg)',
    lowestRegion: 'Greenhouse Boyolali (Rp 24.000/kg)'
  },
  {
    id: 'mp-gabah-kering',
    commodityName: 'Gabah Kering Panen (GKP)',
    category: 'Pangan Pokok',
    currentPrice: 6900,
    previousPrice: 6750,
    changePct: 2.22,
    unit: 'Kg',
    region: 'Sentra Karawang & Sragen',
    trend: 'up',
    history7Days: [6700, 6720, 6750, 6800, 6850, 6880, 6900],
    highestRegion: 'Sumatera Utara (Rp 7.400/kg)',
    lowestRegion: 'Jawa Tengah (Rp 6.600/kg)'
  },
  {
    id: 'mp-jagung-pipil',
    commodityName: 'Jagung Pipil Kering (KA 14%)',
    category: 'Pangan Pokok',
    currentPrice: 5950,
    previousPrice: 6100,
    changePct: -2.46,
    unit: 'Kg',
    region: 'Grobogan & Lampung',
    trend: 'down',
    history7Days: [6150, 6100, 6100, 6050, 6000, 5950, 5950],
    highestRegion: 'Pabrik Pakan Jabar (Rp 6.400/kg)',
    lowestRegion: 'Petani Dompu NTB (Rp 5.200/kg)'
  },
  {
    id: 'mp-tomat-servo',
    commodityName: 'Tomat Sayur Segar',
    category: 'Hortikultura Sayur',
    currentPrice: 11000,
    previousPrice: 9500,
    changePct: 15.79,
    unit: 'Kg',
    region: 'Sentra Lembang & Malang',
    trend: 'up',
    history7Days: [8500, 8800, 9200, 9500, 10000, 10500, 11000],
    highestRegion: 'Batam (Rp 18.000/kg)',
    lowestRegion: 'Malang Petani (Rp 7.500/kg)'
  }
];

export const SUPPLY_CHAIN_MARGINS = [
  {
    stakeholder: 'Petani Produsen',
    sharePct: 45,
    description: 'Menanggung beban biaya benih, pupuk, tenaga olah, dan risiko kegagalan cuaca/hama.',
    typicalMargin: '25% - 40%'
  },
  {
    stakeholder: 'Pengepul Desa / Bakul',
    sharePct: 15,
    description: 'Menyediakan uang tunai cepat, sortir awal, sortasi kualitas, dan pengumpulan kuota angkut.',
    typicalMargin: '10% - 15%'
  },
  {
    stakeholder: 'Bandar / Pasar Induk Regional',
    sharePct: 20,
    description: 'Menanggung biaya armada truk antarpulau, retribusi los pasar, dan risiko susut bobot (5-8%).',
    typicalMargin: '12% - 18%'
  },
  {
    stakeholder: 'Pengecer / Supermarket Akhir',
    sharePct: 20,
    description: 'Penjualan ke konsumen rumah tangga, biaya sewa toko, display pendingin, dan risiko busuk tak terjual.',
    typicalMargin: '20% - 30%'
  }
];
