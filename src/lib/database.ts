import alasql from 'alasql';
import {
  BusinessConfig,
  User,
  ElectronicComponent,
  Product,
  Customer,
  Supplier,
  Invoice,
  Quotation,
  RepairJob,
  CctvProject,
  Purchase,
  Expense,
  Account,
  JournalEntry,
  TelecomOperator,
  TelecomTransaction,
  Employee,
  AttendanceRecord,
  AttendanceShiftCategory,
  CloudDriveFile,
  Branch,
  LoyaltyCard,
  DamageEntry,
  EmergencyAlert,
  AuditLog,
  AppNotification,
  PhoneBrand,
  PhoneDevice,
  LandingPageConfig,
  ThemePreset,
  AnimationLevel
} from '../types';
import { generateEAN13, generateIMEI, generateSerial, generateSlDocNo, generateBarcodeSvg, generateQrCodeSvg } from './barcode';
import { SoundEngine } from './sound';

export const DEFAULT_LANDING_PAGE: LandingPageConfig = {
  domainName: 'toptelecom.om',
  heroTitle: 'Top Telecom Oman & Enterprise Mobile Hub',
  heroSubtitle: 'Official Wholesale & Retail Distributor of Global Smartphones, 5G Devices & Microelectronics',
  heroTagline: 'Serving Oman Businesses, Telecom Operators & Consumers with Certified Technology & Nationwide Delivery',
  heroBadge: 'Sultanate of Oman • CR 1374092 • 10,633+ Models Supported',
  aboutText: 'Top Telecom Oman & RST Electronics is the Sultanate’s premier technology enterprise, offering direct access to 116+ worldwide smartphone brands, certified electronic components, precision lab repairs, CCTV surveillance, and nationwide corporate supply. Governed by Sultanate of Oman commercial regulations and 5% VAT compliance.',
  servicesHighlights: [
    { title: '116+ Smartphone Brands', desc: 'Direct access to 10,633+ certified smartphone models from Apple, Samsung, Xiaomi, Huawei, Honor, Google and global distributors.', icon: 'Smartphone' },
    { title: 'Telecom Oman Bill Pay', desc: 'Instant bill payments and recharge for Omantel, Ooredoo, Vodafone, Nama Electricity & Water.', icon: 'Zap' },
    { title: 'B2B Wholesale & Quotations', desc: 'Competitive commercial pricing, custom enterprise tenders, and fast quotation delivery for corporate clients.', icon: 'Building2' },
    { title: 'Precision Component Lab & Repairs', desc: 'Microcontrollers, sensors, display assemblies, soldering stations, board diagnostics, and warranty service.', icon: 'Cpu' }
  ],
  portfolioStats: [
    { label: 'Smartphone Models', value: '10,633+' },
    { label: 'Global Brands', value: '116' },
    { label: 'Oman Retail Customers', value: '50,000+' },
    { label: 'Nationwide Delivery', value: '11 Governorates' }
  ],
  companyHighlights: [
    'Authorized Oman Distributor for Leading Global Mobile Brands',
    'Integrated Omantel, Ooredoo & Vodafone Telecom Infrastructure',
    'Same-Day Delivery in Muscat & Express Shipping to Salalah, Sohar, Nizwa',
    'Official Oman 5% VAT Invoicing & Certified Device Warranties'
  ],
  contactWhatsapp: '+96894301393',
  contactAddress: 'Road No 6, Mabellah Sanaya, Muscat Governorate, Sultanate of Oman',
  contactEmail: 'Eletrocnisrst@gmail.com',
  enableVisitorShowcase: true,
  hidePricesInShowcase: true,
  featuredModelIds: [1, 2, 3, 4, 5, 6, 7, 8],
  blogPosts: [
    {
      id: 1,
      title: 'Top Telecom Oman 5G Network Rollout: What It Means for Smartphones',
      slug: 'oman-5g-network-rollout',
      summary: 'An in-depth analysis of high-speed 5G connectivity expansion across Muscat, Salalah, and Sohar, and compatible mobile chipsets.',
      content: 'As Oman accelerates its Vision 2040 digital transformation, 5G network coverage has reached over 88% of populated areas across the Sultanate. Leading telecom operators Omantel, Ooredoo, and Vodafone have activated massive MIMO base stations delivering gigabit downlink speeds. To leverage this infrastructure, smartphones equipped with modern Sub-6GHz and mmWave modems (such as Qualcomm Snapdragon X70 and MediaTek Dimensity 9300) ensure ultra-low latency gaming, high-definition VoLTE calls, and seamless enterprise cloud access. At Top Telecom Oman, all our mobile stock is verified for regional band compatibility (n78, n41, n1, n3).',
      author: 'Eng. Tariq Al-Balushi (Top Telecom Oman)',
      date: '2026-10-10',
      category: 'Telecom & 5G',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      tags: ['5G Oman', 'Omantel', 'Ooredoo', 'Snapdragon', 'Top Telecom'],
      readTime: '4 min read',
      published: true
    },
    {
      id: 2,
      title: 'Prolonging Smartphone Battery Health in Arabian Gulf High Temperatures',
      slug: 'battery-health-gulf-climate',
      summary: 'Practical guidelines to preserve Li-Ion and Li-Po batteries in summer temperatures exceeding 45°C.',
      content: 'Ambient temperatures in Oman frequently exceed 40°C during peak summer months, posing significant stress on lithium polymer smartphone batteries. Lithium degradation accelerates when cells remain at 100% state-of-charge while exposed to heat. We recommend: 1) Utilizing 80% charge limits when available in iOS or Android settings; 2) Avoiding rapid wireless charging while driving in vehicles directly exposed to sun; 3) Removing heavy thermal insulating phone cases during intensive tasks; and 4) Replacing batteries at certified service centers when maximum capacity drops below 80%.',
      author: 'RST Certified Electronics Lab',
      date: '2026-09-28',
      category: 'Maintenance & Care',
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
      tags: ['Battery Care', 'Heat Management', 'Mobile Tips', 'Oman Summer'],
      readTime: '3 min read',
      published: true
    },
    {
      id: 3,
      title: 'Understanding OLED, AMOLED vs TFT LCD Displays in Modern Handsets',
      slug: 'oled-amoled-vs-lcd-displays',
      summary: 'A technical comparison between display technologies: contrast ratios, refresh rates, and power consumption.',
      content: 'Display panels represent the single most utilized component of modern smartphones. Super AMOLED and Dynamic LTPO OLED displays emit light per individual pixel, resulting in true infinite contrast ratios and zero power consumption for black pixels in dark mode. Furthermore, variable refresh rate technologies (1Hz to 120Hz) intelligently save battery life during static reading while delivering buttery smooth scrolling in apps. For wholesale buyers and repair specialists, verifying original OEM specifications versus cheap aftermarket reproductions is paramount for touch digitizer responsiveness and peak brightness.',
      author: 'Hardware Engineering Team',
      date: '2026-09-15',
      category: 'Hardware Specs',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      tags: ['AMOLED', 'Displays', 'Hardware', 'Screen Guide'],
      readTime: '5 min read',
      published: true
    }
  ]
};

export const DEFAULT_CONFIG: BusinessConfig = {
  business_name: 'TOP TELECOM OMAN & RST ELECTRONICS',
  legal_name: 'TOP TELECOM & AL WAHA AL KHDRA TRADING LLC',
  cr_no: '1374092',
  tax_no: 'OM-VAT-1374092-2024',
  address: 'Mabellah Sanaya, Road No 6, Muscat, Sultanate of Oman',
  phone: '+968 9430 1393',
  email: 'Eletrocnisrst@gmail.com',
  website: 'https://toptelecom.om',
  currency: 'OMR',
  currency_symbol: 'ر.ع.',
  vatRate: 0.05,
  vatEnabled: true,
  decimalPlaces: 3,
  invoice_prefix: 'RST',
  quotation_prefix: 'QT',
  sl_doc_prefix: 'SL-DOC',
  lowStockAlert: 10,
  telecomLowBalanceAlert: 20.000,
  themePreset: 'emerald',
  animationLevel: 'smooth',
  fontScale: 'normal',
  tableDensity: 'balanced',
  hideProfitInPOS: false,
  hideCostPriceInPOS: false,
  requireImeiForMobile: true,
  soundAlerts: {
    enabled: true,
    volume: 0.5,
    siren: true,
    cashRegister: true,
    scannerBeep: true,
    buttonClick: true
  },
  voiceControl: {
    enabled: true,
    speechOutput: true,
    preferredVoiceLang: 'en-US'
  },
  creditAlertThresholdDays: 7,
  widgetVisibility: {
    emergencyBanner: true,
    cashCalculator: true,
    branchSales: true,
    vipCustomers: true,
    paymentBreakdown: true,
    telecomAlerts: true,
    pendingCheques: true,
    weeklyChart: true,
    recentInvoices: true
  },
  widgetPinned: {
    emergencyBanner: true,
    cashCalculator: true,
    branchSales: true
  },
  googleDrive: {
    connected: true,
    accountEmail: 'admin@toptelecom.om',
    folderName: 'TopTelecom_Oman_ERP_Vault',
    folderId: 'drive_vault_0918237',
    autoBackupDaily: true,
    lastBackupTimestamp: new Date().toISOString(),
    totalSyncedFiles: 28,
    usedStorageBytes: 154200000,
    maxStorageBytes: 16106127360
  },
  landingPage: DEFAULT_LANDING_PAGE
};

const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    fullname: 'Master System Administrator',
    role: 'master_admin',
    branch: 1,
    branchName: 'Main Branch - Mabellah Sanaya',
    phone: '+968 9430 1393',
    email: 'admin@toptelecom.om',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    active: true,
    permissions: {
      canEditPrice: true,
      canViewProfit: true,
      canViewCostPrice: true,
      canTriggerEmergency: true,
      canStopEmergency: true,
      canRunSql: true,
      canManageUsers: true,
      canApprovePayroll: true,
      canDeleteInventory: true,
      canAccessSettings: true,
      canManageGoogleDrive: true,
      canIssueDiscounts: true,
      canProcessRefunds: true
    },
    hiddenPages: [],
    hiddenOptions: {
      hideCostPrice: false,
      hideProfitMargin: false,
      hideSupplierBalances: false,
      hideFinancialSummary: false,
      hideDamagesCost: false,
      hidePayroll: false
    },
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    username: 'cashier1',
    password: 'cashier123',
    fullname: 'Salim Al-Harthy',
    role: 'cashier',
    branch: 1,
    branchName: 'Main Branch - Mabellah Sanaya',
    phone: '+968 9123 4567',
    email: 'salim.pos@toptelecom.om',
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    active: true,
    permissions: {
      canEditPrice: false,
      canViewProfit: false,
      canViewCostPrice: false,
      canTriggerEmergency: true,
      canStopEmergency: false,
      canRunSql: false,
      canManageUsers: false,
      canApprovePayroll: false,
      canDeleteInventory: false,
      canAccessSettings: false,
      canManageGoogleDrive: false,
      canIssueDiscounts: false,
      canProcessRefunds: false
    },
    hiddenPages: ['adminCenter', 'sqlStudio', 'accounting', 'googleDrive', 'hrmAttendance'],
    hiddenOptions: {
      hideCostPrice: true,
      hideProfitMargin: true,
      hideSupplierBalances: true,
      hideFinancialSummary: true,
      hideDamagesCost: true,
      hidePayroll: true
    },
    createdAt: '2024-02-15'
  },
  {
    id: 3,
    username: 'manager_seeb',
    password: 'manager123',
    fullname: 'Eng. Tariq Al-Maawali',
    role: 'manager',
    branch: 2,
    branchName: 'Seeb Souq Branch',
    phone: '+968 9456 7890',
    email: 'tariq.mgr@toptelecom.om',
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    active: true,
    permissions: {
      canEditPrice: true,
      canViewProfit: true,
      canViewCostPrice: true,
      canTriggerEmergency: true,
      canStopEmergency: false,
      canRunSql: false,
      canManageUsers: false,
      canApprovePayroll: true,
      canDeleteInventory: false,
      canAccessSettings: false,
      canManageGoogleDrive: true,
      canIssueDiscounts: true,
      canProcessRefunds: true
    },
    hiddenPages: ['sqlStudio'],
    hiddenOptions: {
      hideCostPrice: false,
      hideProfitMargin: false,
      hideSupplierBalances: false,
      hideFinancialSummary: false,
      hideDamagesCost: false,
      hidePayroll: false
    },
    createdAt: '2024-03-01'
  },
  {
    id: 4,
    username: 'accountant',
    password: 'acc123',
    fullname: 'Fatima Al-Lawati',
    role: 'accountant',
    branch: 1,
    branchName: 'Main Branch - Mabellah Sanaya',
    phone: '+968 9765 4321',
    email: 'fatima.fin@toptelecom.om',
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    active: true,
    permissions: {
      canEditPrice: false,
      canViewProfit: true,
      canViewCostPrice: true,
      canTriggerEmergency: true,
      canStopEmergency: false,
      canRunSql: false,
      canManageUsers: false,
      canApprovePayroll: true,
      canDeleteInventory: false,
      canAccessSettings: false,
      canManageGoogleDrive: true,
      canIssueDiscounts: false,
      canProcessRefunds: true
    },
    hiddenPages: ['sqlStudio', 'adminCenter'],
    hiddenOptions: {
      hideCostPrice: false,
      hideProfitMargin: false,
      hideSupplierBalances: false,
      hideFinancialSummary: false,
      hideDamagesCost: false,
      hidePayroll: false
    },
    createdAt: '2024-04-10'
  }
];

const INITIAL_BRANCHES: Branch[] = [
  { id: 1, name: 'Main Branch - Mabellah Sanaya', code: 'RST-MAIN', address: 'Road No 6, Mabellah, Muscat', phone: '+968 9430 1393', salesToday: 485.500, is_active: true },
  { id: 2, name: 'Seeb Souq Branch', code: 'RST-SEEB', address: 'Seeb Corniche Market, Muscat', phone: '+968 9570 6628', salesToday: 215.200, is_active: true },
  { id: 3, name: 'Salalah Industrial Branch', code: 'RST-SLL', address: 'Sanaya, Salalah, Dhofar', phone: '+968 9234 5678', salesToday: 130.000, is_active: true },
  { id: 4, name: 'Sohar Port Branch', code: 'RST-SOH', address: 'Falaj Al Qabail, Sohar', phone: '+968 9345 6789', salesToday: 95.800, is_active: true }
];

const INITIAL_OPERATORS: TelecomOperator[] = [
  { id: 1, name: 'Omantel', code: 'OMT', color: '#00a651', balance: 85.500, commissionType: 'percent', commissionValue: 2.5, lowAlertThreshold: 20.000, is_active: true },
  { id: 2, name: 'Ooredoo Oman', code: 'OOD', color: '#ed1c24', balance: 62.000, commissionType: 'fixed', commissionValue: 0.050, lowAlertThreshold: 20.000, is_active: true },
  { id: 3, name: 'Vodafone Oman', code: 'VDF', color: '#e60000', balance: 14.200, commissionType: 'percent', commissionValue: 2.0, lowAlertThreshold: 20.000, is_active: true },
  { id: 4, name: 'FRiENDi mobile', code: 'FRD', color: '#6f2c91', balance: 9.500, commissionType: 'fixed', commissionValue: 0.035, lowAlertThreshold: 15.000, is_active: true },
  { id: 5, name: 'Renna Mobile', code: 'RNN', color: '#f7931e', balance: 25.000, commissionType: 'fixed', commissionValue: 0.035, lowAlertThreshold: 15.000, is_active: true },
  { id: 6, name: 'Awasr Fiber Telecom', code: 'AWS', color: '#00b0f0', balance: 110.000, commissionType: 'percent', commissionValue: 3.0, lowAlertThreshold: 25.000, is_active: true },
  { id: 7, name: 'Nama Electricity & Water', code: 'NAMA', color: '#0284c7', balance: 75.000, commissionType: 'fixed', commissionValue: 0.100, lowAlertThreshold: 20.000, is_active: true }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    sku: 'PHN-APL-IP15P-256',
    name: 'Apple iPhone 15 Pro (256GB - Natural Titanium)',
    brand: 'Apple',
    category: 'Smartphones & Devices',
    cost: 380.000,
    price: 435.000,
    wholesale: 415.000,
    stock: 8,
    lowstock: 3,
    barcode: '8901234567890',
    imei: '356789123456789',
    imei2: '356789123456790',
    serial: 'SN-IP15P-8921',
    condition: 'New',
    batteryHealth: 100,
    color: 'Natural Titanium',
    storage: '256GB',
    ram: '8GB',
    warranty: '1 Year Apple Official Warranty',
    unit: 'pcs',
    description: 'A17 Pro chip, Titanium aerospace chassis, 48MP main camera, USB-C 3.0',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80',
    active: true,
    hasImei: true,
    isComponent: false,
    is_deleted: false
  },
  {
    id: 2,
    sku: 'PHN-SAM-S24U-512',
    name: 'Samsung Galaxy S24 Ultra (512GB - Titanium Gray)',
    brand: 'Samsung',
    category: 'Smartphones & Devices',
    cost: 395.000,
    price: 450.000,
    wholesale: 430.000,
    stock: 6,
    lowstock: 2,
    barcode: '8901234567891',
    imei: '987654321123456',
    imei2: '987654321123457',
    serial: 'SN-S24U-4109',
    condition: 'New',
    batteryHealth: 100,
    color: 'Titanium Gray',
    storage: '512GB',
    ram: '12GB',
    warranty: '1 Year Samsung Gulf Warranty',
    unit: 'pcs',
    description: 'Snapdragon 8 Gen 3, S-Pen included, 200MP Quad Telephoto AI engine',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=400&q=80',
    active: true,
    hasImei: true,
    isComponent: false,
    is_deleted: false
  },
  {
    id: 3,
    sku: 'ACC-ANK-65W-GAN',
    name: 'Anker 65W GaN Fast Charger & Type-C Braided Cable',
    brand: 'Anker',
    category: 'Accessories & Multimedia',
    cost: 9.800,
    price: 16.500,
    wholesale: 13.000,
    stock: 35,
    lowstock: 8,
    barcode: '8903001002015',
    warranty: '18 Months Replacement Warranty',
    unit: 'pcs',
    description: 'High-speed Multi-port GaN charger compatible with laptops and smartphones',
    active: true,
    hasImei: false,
    isComponent: false,
    is_deleted: false
  },
  {
    id: 4,
    sku: 'CCTV-HIK-4K-KIT',
    name: 'Hikvision 4K 8MP PoE ColorVu Night-Vision Dome Camera',
    brand: 'Hikvision',
    category: 'CCTV & Accessories',
    cost: 22.500,
    price: 34.000,
    wholesale: 28.500,
    stock: 15,
    lowstock: 4,
    barcode: '8903001001155',
    warranty: '2 Years Manufacturer Warranty',
    unit: 'pcs',
    description: '24/7 full color night vision, IP67 weatherproof metal turret, built-in mic',
    active: true,
    hasImei: false,
    isComponent: false,
    is_deleted: false
  }
];

const INITIAL_COMPONENTS: ElectronicComponent[] = [
  {
    id: 101,
    sku: 'MCU-ESP32-WROOM',
    name: 'ESP32-WROOM-32D Dual-Core MCU Module',
    category: 'Microcontrollers',
    subcategory: 'Wi-Fi & Bluetooth MCUs',
    packageType: 'SMD Module (38-pin)',
    voltage: '3.0V - 3.6V (5V DevKit)',
    specs: {
      'CPU': 'Xtensa Dual-Core 32-bit LX6 @ 240MHz',
      'Flash Memory': '4MB SPI Flash',
      'SRAM': '520 KB',
      'Wireless': 'Wi-Fi 802.11 b/g/n + BLE 4.2',
      'GPIO': '36 programmable pins'
    },
    pinoutSummary: 'Pin 1: GND, Pin 2: 3V3, Pin 3: EN, Pin 11: GPIO21 (SDA), Pin 14: GPIO22 (SCL), Pin 25: GPIO2 (Built-in LED)',
    description: 'High-performance dual-core microcontroller with integrated Wi-Fi and Bluetooth. Ideal for IoT and automation.',
    cost: 1.450,
    price: 2.200,
    stock: 45,
    minStock: 10,
    barcode: '8903001001018',
    isPopular: true,
    tags: ['iot', 'wifi', 'bluetooth', 'arduino', 'espressif']
  },
  {
    id: 102,
    sku: 'MCU-ATMEGA328P-PU',
    name: 'ATmega328P-PU 8-bit AVR Microcontroller',
    category: 'Microcontrollers',
    subcategory: 'AVR Core',
    packageType: 'DIP-28',
    voltage: '1.8V - 5.5V',
    specs: {
      'Architecture': '8-bit AVR RISC @ 16MHz',
      'Flash': '32 KB (with Bootloader)',
      'EEPROM': '1 KB',
      'SRAM': '2 KB'
    },
    pinoutSummary: 'Pin 1: RESET, Pin 7: VCC, Pin 8: GND, Pin 9-10: XTAL, Pin 14-19: Digital/PWM, Pin 23-28: Analog A0-A5',
    description: 'The standard microcontroller chip powering the Arduino Uno. High reliability for embedded prototypes.',
    cost: 0.950,
    price: 1.650,
    stock: 8,
    minStock: 10,
    barcode: '8903001001025',
    isPopular: true,
    tags: ['arduino', 'dip-28', 'avr', 'atmega']
  },
  {
    id: 105,
    sku: 'SENS-DHT22-AM2302',
    name: 'DHT22 / AM2302 Digital Temperature & Humidity Sensor',
    category: 'Sensors',
    subcategory: 'Environmental Sensors',
    packageType: '4-Pin Moduled Package',
    voltage: '3.3V - 6V DC',
    specs: {
      'Temp Range': '-40°C to +80°C (±0.5°C accuracy)',
      'Humidity Range': '0% to 100% RH (±2% accuracy)'
    },
    pinoutSummary: 'Pin 1: VCC (3.3V-5V), Pin 2: DATA, Pin 3: NC, Pin 4: GND',
    description: 'Calibrated digital output temperature and humidity sensor module with capacitive sensing element.',
    cost: 1.100,
    price: 1.850,
    stock: 6,
    minStock: 8,
    barcode: '8903001001056',
    isPopular: true,
    tags: ['temperature', 'humidity', 'weather']
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1,
    name: 'Sheikh Nasser Al-Kindi (VIP)',
    phone: '+968 9988 7766',
    whatsapp: '+968 9988 7766',
    email: 'nasser.kindi@omanroyal.om',
    address: 'Mabellah South, Muscat',
    cr_no: '1098234',
    vat_no: 'OM-VAT-992384',
    balance: 0,
    credit_limit: 2000.000,
    creditDays: 0,
    isVip: true,
    loyaltyPoints: 340,
    loyaltyTier: 'Gold',
    is_deleted: false
  },
  {
    id: 2,
    name: 'Salim Al-Harthy',
    phone: '+968 9123 4567',
    email: 'salim.harthy@oman.om',
    address: 'Al Khoud, Seeb',
    balance: 45.500,
    credit_limit: 300.000,
    creditDays: 9,
    isVip: true,
    loyaltyPoints: 210,
    loyaltyTier: 'Silver',
    is_deleted: false
  },
  {
    id: 3,
    name: 'Dr. Tariq Al Maawali',
    phone: '+968 9456 7890',
    email: 'tariq.iot@squ.edu.om',
    address: 'SQU Tech Research Lab',
    balance: 85.000,
    credit_limit: 500.000,
    creditDays: 14,
    isVip: true,
    loyaltyPoints: 520,
    loyaltyTier: 'Gold',
    is_deleted: false
  }
];

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: 'Gulf Telecom Distribution LLC',
    contact_person: 'Mohammad Al-Jabri',
    phone: '+968 2470 1122',
    email: 'sales@gulftelecom.om',
    address: 'Ruwi High Street, Muscat',
    cr_no: '1029384',
    vat_no: 'OM-VAT-1029384',
    balance: 420.000,
    created_at: '2024-01-10'
  },
  {
    id: 2,
    name: 'Anker Regional Middle East FZCO',
    contact_person: 'David Chen',
    phone: '+971 4 881 2233',
    email: 'b2b@anker-me.com',
    address: 'JAFZA, Dubai / Muscat Hub',
    balance: 150.000,
    created_at: '2024-02-14'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 1,
    invoice_no: 'RST-00001',
    sl_doc_no: 'SL-DOC-2026-00001',
    date: new Date().toLocaleDateString() + ' 10:30 AM',
    customer: 'Sheikh Nasser Al-Kindi (VIP)',
    customer_phone: '+968 9988 7766',
    customer_id: 1,
    items: [
      { id: 1, name: 'Apple iPhone 15 Pro (256GB - Natural Titanium)', price: 435.000, cost: 380.000, qty: 1, imei: '356789123456789', warranty: '1 Year Apple Official' },
      { id: 3, name: 'Anker 65W GaN Fast Charger & Type-C Braided Cable', price: 16.500, cost: 9.800, qty: 2 }
    ],
    subtotal: 468.000,
    discount: 10.000,
    vat: 22.900,
    vat_rate: 0.05,
    grand_total: 480.900,
    paid: 480.900,
    balance: 0,
    payment: 'Card',
    amountReceivedCash: 0,
    amountReceivedBankSwift: 480.900,
    bankSwiftMachineNo: 'SWIFT-BML-04',
    profit: 78.400,
    branch: 'Main Branch - Mabellah Sanaya',
    operator: 'admin',
    status: 'Paid',
    qrCodeData: 'OM-TAX-AUTH|RST-00001|480.900|22.900|1374092'
  }
];

const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 1,
    quote_no: 'QT-2026-0001',
    sl_doc_no: 'SL-DOC-2026-00101',
    customer_id: 1,
    customer_name: 'Sheikh Nasser Al-Kindi (VIP)',
    customer_phone: '+968 9944 1122',
    customer_email: 'nasser.kindi@omanroyal.om',
    date: new Date().toISOString().slice(0, 10),
    valid_until: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    items: [
      { id: 1, name: 'Apple iPhone 16 Pro Max 256GB Natural Titanium', price: 520.000, cost: 450.000, qty: 2, warranty: '1 Year Apple Official' },
      { id: 2, name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black', price: 445.000, cost: 395.000, qty: 1, warranty: '1 Year Samsung Gulf' },
      { id: 3, name: 'Anker 65W GaN Fast Charger & Type-C Braided Cable', price: 16.500, cost: 9.800, qty: 3, isComponent: false }
    ],
    subtotal: 1534.500,
    discount: 50.000,
    vat: 74.225,
    grand_total: 1558.725,
    status: 'Approved',
    notes: 'Official VIP tender quotation for corporate handset refresh. Delivery to Al-Khuwair corporate office.',
    terms: 'Prices valid for 14 days in Sultanate of Oman. VAT @ 5.000% applicable. Includes free screen protector application.'
  }
];

const INITIAL_REPAIRS: RepairJob[] = [
  {
    id: 1,
    job_card_no: 'REP-2026-001',
    sl_doc_no: 'SL-DOC-2026-00501',
    customer_name: 'Ahmed Al-Balushi',
    customer_phone: '+968 9988 7766',
    device_brand: 'Apple',
    device_model: 'iPhone 14 Pro',
    imei_or_serial: '358912048591245',
    fault_reported: 'Screen cracked & touch digitizer not responsive after impact',
    diagnosis: 'Original Super Retina OLED replacement required. Frame straight.',
    technician_assigned: 'Eng. Tariq Al-Maawali',
    estimated_cost: 65.000,
    parts_cost: 38.000,
    advance_paid: 20.000,
    balance_due: 45.000,
    status: 'In Progress',
    warranty_period: '90 Days Lab Warranty',
    date_received: new Date().toISOString().slice(0, 10),
    notes: 'Customer requested OEM display panel only.'
  }
];

const INITIAL_CCTV: CctvProject[] = [
  {
    id: 1,
    project_no: 'CCTV-2026-01',
    sl_doc_no: 'SL-DOC-2026-00601',
    client_name: 'Al-Waha Luxury Villa Complex',
    client_phone: '+968 9123 4567',
    site_address: 'Mabellah Phase 4, Way 4821',
    camera_count: 8,
    dvr_nvr_model: 'Hikvision 8-Ch 4K PoE NVR',
    hdd_capacity: '4TB Surveillance Grade HDD',
    total_value: 380.000,
    advance_paid: 200.000,
    balance_due: 180.000,
    lead_technician: 'Nasser Al-Kindi',
    installation_date: new Date().toISOString().slice(0, 10),
    status: 'In Progress',
    notes: 'Wiring completed. Camera mounting scheduled for tomorrow morning.'
  }
];

const INITIAL_CLOUD_FILES: CloudDriveFile[] = [
  {
    id: 'doc-001',
    sl_doc_no: 'SL-DOC-2026-00001',
    fileName: 'RST_Commercial_Registration_CR1374092.pdf',
    fileType: 'pdf',
    category: 'CR Legal',
    sizeBytes: 1420500,
    uploadDate: '2026-10-15',
    uploadedBy: 'admin',
    driveFolder: 'Legal_Certificates',
    googleDriveSyncStatus: 'synced',
    googleDriveUrl: 'https://drive.google.com/file/d/demo_cr1374092',
    notes: 'Official Ministry of Commerce & Industry CR Certificate copy'
  },
  {
    id: 'doc-002',
    sl_doc_no: 'SL-DOC-2026-00002',
    fileName: 'Oman_Tax_Authority_VAT_Certificate.pdf',
    fileType: 'pdf',
    category: 'Tax Filing',
    sizeBytes: 890000,
    uploadDate: '2026-10-18',
    uploadedBy: 'admin',
    driveFolder: 'Tax_Compliance',
    googleDriveSyncStatus: 'synced',
    googleDriveUrl: 'https://drive.google.com/file/d/demo_vat_cert',
    notes: 'VAT Registration OM-VAT-1374092 verified'
  },
  {
    id: 'doc-003',
    sl_doc_no: 'SL-DOC-2026-00003',
    fileName: 'Omantel_Franchise_Agency_Agreement.pdf',
    fileType: 'contract',
    category: 'Suppliers',
    sizeBytes: 2150000,
    uploadDate: '2026-10-20',
    uploadedBy: 'admin',
    driveFolder: 'Agency_Agreements',
    googleDriveSyncStatus: 'synced',
    notes: 'Authorized telecom recharge counter certification'
  }
];

const INITIAL_SHIFTS: AttendanceShiftCategory[] = [
  { id: 1, name: 'Morning Shift', startTime: '08:00', endTime: '16:30', standardHours: 8, defaultBreakMinutes: 60, overtimeThresholdHours: 8.5, overtimeRateMultiplier: 1.5, color: '#10b981' },
  { id: 2, name: 'Evening Shift', startTime: '16:00', endTime: '00:30', standardHours: 8, defaultBreakMinutes: 60, overtimeThresholdHours: 8.5, overtimeRateMultiplier: 1.5, color: '#3b82f6' },
  { id: 3, name: 'Full Day Technical', startTime: '08:30', endTime: '18:00', standardHours: 9, defaultBreakMinutes: 60, overtimeThresholdHours: 9.5, overtimeRateMultiplier: 1.5, color: '#f59e0b' },
  { id: 4, name: 'Part Time / Half Day', startTime: '09:00', endTime: '13:00', standardHours: 4, defaultBreakMinutes: 0, overtimeThresholdHours: 4.5, overtimeRateMultiplier: 1.25, color: '#8b5cf6' }
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, code: 'EMP-001', name: 'Ahmed Al Balushi', designation: 'Senior Hardware Engineer', department: 'R&D / Technical', shiftCategory: 'Morning Shift', hourlyRate: 3.500, phone: '+968 9988 7766', email: 'ahmed.eng@toptelecom.om', branch: 'Main Branch - Mabellah Sanaya', status: 'Active' },
  { id: 2, code: 'EMP-002', name: 'Salim Al Harthy', designation: 'Sales & POS Supervisor', department: 'Sales & Counter', shiftCategory: 'Full Day Technical', hourlyRate: 2.800, phone: '+968 9123 4567', email: 'salim.pos@toptelecom.om', branch: 'Main Branch - Mabellah Sanaya', status: 'Active' },
  { id: 3, code: 'EMP-003', name: 'Tariq Al Maawali', designation: 'Embedded Systems Specialist', department: 'Engineering', shiftCategory: 'Morning Shift', hourlyRate: 4.200, phone: '+968 9456 7890', email: 'tariq.m@toptelecom.om', branch: 'Seeb Souq Branch', status: 'Active' },
  { id: 4, code: 'EMP-004', name: 'Fatima Al Lawati', designation: 'Accounts & Cashier Lead', department: 'Finance & Cashier', shiftCategory: 'Morning Shift', hourlyRate: 2.500, phone: '+968 9765 4321', email: 'fatima.fin@toptelecom.om', branch: 'Main Branch - Mabellah Sanaya', status: 'Active' },
  { id: 5, code: 'EMP-005', name: 'Nasser Al Kindi', designation: 'CCTV Installation Technician', department: 'Field Operations', shiftCategory: 'Evening Shift', hourlyRate: 2.750, phone: '+968 9876 1122', email: 'nasser.tech@toptelecom.om', branch: 'Salalah Industrial Branch', status: 'Active' }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeCode: 'EMP-001',
    employeeName: 'Ahmed Al Balushi',
    branch: 'Main Branch - Mabellah Sanaya',
    date: new Date().toISOString().slice(0, 10),
    checkInTime: '08:00',
    breakMinutes: 60,
    totalHours: 0,
    overtimeHours: 0,
    shiftCategory: 'Morning Shift',
    status: 'Checked In',
    hourlyRate: 3.500,
    calculatedPay: 0,
    isApproved: false,
    notes: 'Morning shift started on technical lab bench'
  },
  {
    id: 2,
    employeeId: 2,
    employeeCode: 'EMP-002',
    employeeName: 'Salim Al Harthy',
    branch: 'Main Branch - Mabellah Sanaya',
    date: new Date().toISOString().slice(0, 10),
    checkInTime: '08:25',
    breakMinutes: 60,
    totalHours: 0,
    overtimeHours: 0,
    shiftCategory: 'Full Day Technical',
    status: 'Checked In',
    hourlyRate: 2.800,
    calculatedPay: 0,
    isApproved: false,
    notes: 'POS sales terminal active'
  }
];

const INITIAL_ACCOUNTS: Account[] = [
  { code: '1010', name: 'Cash in Hand (Counter)', type: 'Asset', balance: 520.450 },
  { code: '1020', name: 'Bank Muscat SWIFT Current A/C', type: 'Asset', balance: 4890.000 },
  { code: '1030', name: 'Accounts Receivable (Customers)', type: 'Asset', balance: 215.500 },
  { code: '1040', name: 'Inventory Asset (Merchandise)', type: 'Asset', balance: 14200.000 },
  { code: '2010', name: 'Accounts Payable (Suppliers)', type: 'Liability', balance: 850.000 },
  { code: '2020', name: 'Oman VAT Output Payable (5%)', type: 'Liability', balance: 124.500 },
  { code: '3010', name: "Owner's Equity / Paid-in Capital", type: 'Equity', balance: 18000.000 },
  { code: '4010', name: 'Sales Revenue (Mobile & Electronics)', type: 'Revenue', balance: 2450.000 },
  { code: '4020', name: 'Service & Repair Income', type: 'Revenue', balance: 340.000 },
  { code: '4030', name: 'Telecom Commission Income', type: 'Revenue', balance: 85.000 },
  { code: '5010', name: 'Cost of Goods Sold (COGS)', type: 'Expense', balance: 1980.000 },
  { code: '5020', name: 'Shop Utilities & Rent', type: 'Expense', balance: 280.000 }
];

const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 1,
    entry_no: 'JRN-2026-0001',
    date: new Date().toISOString().slice(0, 10),
    reference_type: 'Sale',
    reference_id: 'RST-00001',
    description: 'Auto-journal posted for Tax Invoice RST-00001',
    lines: [
      { account_code: '1020', account_name: 'Bank Muscat SWIFT Current A/C', debit: 480.900, credit: 0 },
      { account_code: '4010', account_name: 'Sales Revenue (Mobile & Electronics)', debit: 0, credit: 458.000 },
      { account_code: '2020', account_name: 'Oman VAT Output Payable (5%)', debit: 0, credit: 22.900 },
      { account_code: '5010', account_name: 'Cost of Goods Sold (COGS)', debit: 399.600, credit: 0 },
      { account_code: '1040', account_name: 'Inventory Asset (Merchandise)', debit: 0, credit: 399.600 }
    ],
    total_amount: 880.500,
    created_by: 'system'
  }
];

class DatabaseManager {
  public config: BusinessConfig;
  public users: User[];
  public branches: Branch[];
  public products: Product[];
  public components: ElectronicComponent[];
  public customers: Customer[];
  public suppliers: Supplier[];
  public invoices: Invoice[];
  public quotations: Quotation[];
  public repairs: RepairJob[];
  public cctvProjects: CctvProject[];
  public telecomOperators: TelecomOperator[];
  public telecomTx: TelecomTransaction[];
  public cloudFiles: CloudDriveFile[];
  public employees: Employee[];
  public attendanceRecords: AttendanceRecord[];
  public shifts: AttendanceShiftCategory[];
  public accounts: Account[];
  public journals: JournalEntry[];
  public expenses: Expense[];
  public damages: DamageEntry[];
  public loyaltyCards: LoyaltyCard[];
  public auditLogs: AuditLog[];
  public notifications: AppNotification[];
  public activeEmergency: EmergencyAlert | null;
  public phoneBrands: PhoneBrand[] = [];
  public phoneDevices: PhoneDevice[] = [];
  private isPhoneCatalogLoaded = false;

  // Real-time financial variables for Cash in Hand Calculator
  public purchasedTotalToday = 145.000;
  public expensesTotalToday = 28.500;
  public returnsTotalToday = 8.000;
  public pendingChequesCount = 3;
  public pendingChequesAmount = 240.000;

  constructor() {
    this.config = this.load('rst_config', DEFAULT_CONFIG);
    if (!this.config.landingPage) this.config.landingPage = DEFAULT_LANDING_PAGE;
    if (!this.config.googleDrive) this.config.googleDrive = DEFAULT_CONFIG.googleDrive;

    this.users = this.load('rst_users', INITIAL_USERS);
    this.branches = this.load('rst_branches', INITIAL_BRANCHES);
    this.products = this.load('rst_products', INITIAL_PRODUCTS);
    this.components = this.load('rst_components', INITIAL_COMPONENTS);
    this.customers = this.load('rst_customers', INITIAL_CUSTOMERS);
    this.suppliers = this.load('rst_suppliers', INITIAL_SUPPLIERS);
    this.invoices = this.load('rst_invoices', INITIAL_INVOICES);
    this.quotations = this.load('rst_quotations', INITIAL_QUOTATIONS);
    this.repairs = this.load('rst_repairs', INITIAL_REPAIRS);
    this.cctvProjects = this.load('rst_cctv', INITIAL_CCTV);
    this.telecomOperators = this.load('rst_telecom_ops', INITIAL_OPERATORS);
    this.telecomTx = this.load('rst_telecom_tx', []);
    this.cloudFiles = this.load('rst_cloud_files', INITIAL_CLOUD_FILES);
    this.employees = this.load('rst_employees', INITIAL_EMPLOYEES);
    this.attendanceRecords = this.load('rst_attendance', INITIAL_ATTENDANCE);
    this.shifts = this.load('rst_shifts', INITIAL_SHIFTS);
    this.accounts = this.load('rst_accounts', INITIAL_ACCOUNTS);
    this.journals = this.load('rst_journals', INITIAL_JOURNALS);
    this.expenses = this.load('rst_expenses', []);
    this.damages = this.load('rst_damages', []);
    this.loyaltyCards = this.load('rst_loyalty_cards', []);
    this.auditLogs = this.load('rst_audit_logs', [
      { id: 1, user: 'admin', action: 'System started with Google Drive Space & 3-Decimal OMR Accounting', targetType: 'system', targetId: 'boot', time: new Date().toLocaleTimeString(), branch: 'Main Branch' }
    ]);
    this.notifications = this.load('rst_notifications', [
      {
        id: 1,
        title: 'Google Drive Space Online',
        body: 'Cloud Document Vault & Automated Daily DB Backups configured.',
        type: 'drive',
        time: new Date().toLocaleTimeString(),
        read: false
      }
    ]);
    this.activeEmergency = this.load('rst_emergency', null);

    this.initAlaSql();
    this.loadPhoneCatalog();
  }

  private load<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  public persist() {
    try {
      localStorage.setItem('rst_config', JSON.stringify(this.config));
      localStorage.setItem('rst_users', JSON.stringify(this.users));
      localStorage.setItem('rst_branches', JSON.stringify(this.branches));
      localStorage.setItem('rst_products', JSON.stringify(this.products));
      localStorage.setItem('rst_components', JSON.stringify(this.components));
      localStorage.setItem('rst_customers', JSON.stringify(this.customers));
      localStorage.setItem('rst_suppliers', JSON.stringify(this.suppliers));
      localStorage.setItem('rst_invoices', JSON.stringify(this.invoices));
      localStorage.setItem('rst_quotations', JSON.stringify(this.quotations));
      localStorage.setItem('rst_repairs', JSON.stringify(this.repairs));
      localStorage.setItem('rst_cctv', JSON.stringify(this.cctvProjects));
      localStorage.setItem('rst_telecom_ops', JSON.stringify(this.telecomOperators));
      localStorage.setItem('rst_telecom_tx', JSON.stringify(this.telecomTx));
      localStorage.setItem('rst_cloud_files', JSON.stringify(this.cloudFiles));
      localStorage.setItem('rst_employees', JSON.stringify(this.employees));
      localStorage.setItem('rst_attendance', JSON.stringify(this.attendanceRecords));
      localStorage.setItem('rst_shifts', JSON.stringify(this.shifts));
      localStorage.setItem('rst_accounts', JSON.stringify(this.accounts));
      localStorage.setItem('rst_journals', JSON.stringify(this.journals));
      localStorage.setItem('rst_expenses', JSON.stringify(this.expenses));
      localStorage.setItem('rst_damages', JSON.stringify(this.damages));
      localStorage.setItem('rst_loyalty_cards', JSON.stringify(this.loyaltyCards));
      localStorage.setItem('rst_audit_logs', JSON.stringify(this.auditLogs));
      localStorage.setItem('rst_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('rst_emergency', JSON.stringify(this.activeEmergency));
      this.syncAlaSqlTables();
    } catch (e) {
      console.warn('Persistence error:', e);
    }
  }

  public async loadPhoneCatalog(): Promise<{ brands: PhoneBrand[]; devices: PhoneDevice[] }> {
    if (this.isPhoneCatalogLoaded && this.phoneBrands.length > 0) {
      return { brands: this.phoneBrands, devices: this.phoneDevices };
    }
    try {
      const [brandsRes, devicesRes] = await Promise.all([
        fetch('/data/phone_brands.json'),
        fetch('/data/phone_devices.json')
      ]);
      if (brandsRes.ok && devicesRes.ok) {
        this.phoneBrands = await brandsRes.json();
        this.phoneDevices = await devicesRes.json();
        this.isPhoneCatalogLoaded = true;
        this.syncAlaSqlTables();
      }
    } catch (err) {
      console.warn('Could not load phone catalog data:', err);
    }
    return { brands: this.phoneBrands, devices: this.phoneDevices };
  }

  public initAlaSql() {
    try {
      alasql('CREATE DATABASE IF NOT EXISTS rst_db');
      alasql('USE rst_db');
      this.syncAlaSqlTables();
    } catch (err) {
      console.warn('AlaSQL init error:', err);
    }
  }

  public syncAlaSqlTables() {
    try {
      alasql.tables.users = { data: JSON.parse(JSON.stringify(this.users)) };
      alasql.tables.config = { data: [JSON.parse(JSON.stringify(this.config))] };
      alasql.tables.products = { data: JSON.parse(JSON.stringify(this.products)) };
      alasql.tables.components = { data: JSON.parse(JSON.stringify(this.components)) };
      alasql.tables.customers = { data: JSON.parse(JSON.stringify(this.customers)) };
      alasql.tables.suppliers = { data: JSON.parse(JSON.stringify(this.suppliers)) };
      alasql.tables.invoices = { data: JSON.parse(JSON.stringify(this.invoices)) };
      alasql.tables.quotations = { data: JSON.parse(JSON.stringify(this.quotations)) };
      alasql.tables.repairs = { data: JSON.parse(JSON.stringify(this.repairs)) };
      alasql.tables.cctv = { data: JSON.parse(JSON.stringify(this.cctvProjects)) };
      alasql.tables.telecom_operators = { data: JSON.parse(JSON.stringify(this.telecomOperators)) };
      alasql.tables.cloud_files = { data: JSON.parse(JSON.stringify(this.cloudFiles)) };
      alasql.tables.branches = { data: JSON.parse(JSON.stringify(this.branches)) };
      alasql.tables.employees = { data: JSON.parse(JSON.stringify(this.employees)) };
      alasql.tables.attendance = { data: JSON.parse(JSON.stringify(this.attendanceRecords)) };
      alasql.tables.accounts = { data: JSON.parse(JSON.stringify(this.accounts)) };
      alasql.tables.journals = { data: JSON.parse(JSON.stringify(this.journals)) };
      if (this.phoneBrands.length > 0) alasql.tables.phone_brands = { data: this.phoneBrands };
      if (this.phoneDevices.length > 0) alasql.tables.phone_devices = { data: this.phoneDevices };
    } catch (err) {
      console.warn('Sync tables error:', err);
    }
  }

  public executeSql(sqlStatement: string): { 
    success: boolean; 
    data: Record<string, unknown>[]; 
    columns: string[]; 
    message?: string; 
    executionTimeMs: number; 
  } {
    const startTime = performance.now();
    try {
      this.syncAlaSqlTables();
      const result = alasql(sqlStatement);
      const executionTimeMs = Math.round(performance.now() - startTime);

      let data: Record<string, unknown>[] = [];
      if (Array.isArray(result)) {
        data = result;
      } else if (typeof result === 'object' && result !== null) {
        data = [result as Record<string, unknown>];
      }

      const upper = sqlStatement.trim().toUpperCase();
      if (upper.startsWith('INSERT') || upper.startsWith('UPDATE') || upper.startsWith('DELETE')) {
        if (alasql.tables.users?.data) this.users = alasql.tables.users.data as User[];
        if (alasql.tables.products?.data) this.products = alasql.tables.products.data as Product[];
        if (alasql.tables.invoices?.data) this.invoices = alasql.tables.invoices.data as Invoice[];
        if (alasql.tables.customers?.data) this.customers = alasql.tables.customers.data as Customer[];
        this.persist();
      }

      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return {
        success: true,
        data,
        columns,
        message: `Success: ${data.length} row(s) returned`,
        executionTimeMs
      };
    } catch (err: unknown) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: false,
        data: [],
        columns: [],
        message: err instanceof Error ? err.message : String(err),
        executionTimeMs
      };
    }
  }

  /**
   * Cash in Hand Calculator:
   * AT TOTAL SALES + SERVICED - (PURCHASED + EXPENSES) - (BANK SWIFT + BANK TRANSFER + DEPOSIT MONEY) - RETURN = CASH IN HAND NOW
   */
  public calculateCashInHand() {
    const totalSalesAndService = this.invoices.reduce((sum, i) => sum + i.grand_total, 0);
    const servicesAdvanced = this.invoices.reduce((sum, i) => sum + (i.serviceAdvancedPaid || 0), 0);
    const bankSwiftTotal = this.invoices.reduce((sum, i) => sum + (i.amountReceivedBankSwift || (i.payment === 'Card' ? i.grand_total : 0)), 0);
    const bankTransferTotal = this.invoices.reduce((sum, i) => sum + (i.amountReceivedBankTransfer || (i.payment === 'Bank' ? i.grand_total : 0)), 0);
    const creditLedgerTotal = this.invoices.reduce((sum, i) => sum + (i.amountCreditLedger || (i.payment === 'Due' ? i.grand_total : 0)), 0);
    
    const totalInflow = totalSalesAndService + servicesAdvanced;
    const totalOutflow = (this.purchasedTotalToday + this.expensesTotalToday) + (bankSwiftTotal + bankTransferTotal) + this.returnsTotalToday;
    const cashInHandNow = Math.max(0, totalInflow - totalOutflow);

    return {
      totalSalesAndService,
      servicesAdvanced,
      purchasedTotalToday: this.purchasedTotalToday,
      expensesTotalToday: this.expensesTotalToday,
      bankSwiftTotal,
      bankTransferTotal,
      creditLedgerTotal,
      returnsTotalToday: this.returnsTotalToday,
      cashInHandNow,
      netCashInHand: cashInHandNow
    };
  }

  // --- Invoice Creation with Automated Double-Entry Journal Posting ---
  public createInvoice(invData: Omit<Invoice, 'id' | 'invoice_no'>): Invoice {
    const nextNum = this.invoices.length + 1;
    const invoice_no = `${this.config.invoice_prefix}-${String(nextNum).padStart(5, '0')}`;
    const sl_doc_no = generateSlDocNo('SL-DOC', nextNum);

    const qrCodeData = `OM-TAX-AUTH|${invoice_no}|${invData.grand_total.toFixed(3)}|${invData.vat.toFixed(3)}|${this.config.cr_no}|${new Date().toISOString()}`;

    const invoice: Invoice = {
      ...invData,
      id: nextNum,
      invoice_no,
      sl_doc_no,
      qrCodeData
    };

    // 1. Deduct stock
    let cogsTotal = 0;
    invoice.items.forEach(item => {
      const itemCost = item.cost || (item.price * 0.8);
      cogsTotal += itemCost * item.qty;

      if (item.isComponent) {
        const comp = this.components.find(c => c.id === item.id);
        if (comp) comp.stock = Math.max(0, comp.stock - item.qty);
      } else {
        const prod = this.products.find(p => p.id === item.id);
        if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
      }
    });

    this.invoices.unshift(invoice);

    // 2. Post balanced Double-Entry Journal
    const journalId = this.journals.length + 1;
    const taxableAmount = invoice.subtotal - invoice.discount;
    const journalLines = [
      {
        account_code: invoice.payment === 'Cash' ? '1010' : invoice.payment === 'Card' ? '1020' : invoice.payment === 'Bank' ? '1020' : '1030',
        account_name: invoice.payment === 'Cash' ? 'Cash in Hand (Counter)' : invoice.payment === 'Card' ? 'Bank SWIFT Card POS' : invoice.payment === 'Bank' ? 'Bank Current Account' : 'Accounts Receivable',
        debit: Number(invoice.grand_total.toFixed(3)),
        credit: 0
      },
      {
        account_code: '4010',
        account_name: 'Sales Revenue (Mobile & Electronics)',
        debit: 0,
        credit: Number(taxableAmount.toFixed(3))
      },
      {
        account_code: '2020',
        account_name: 'Oman VAT Output Payable (5%)',
        debit: 0,
        credit: Number(invoice.vat.toFixed(3))
      },
      {
        account_code: '5010',
        account_name: 'Cost of Goods Sold (COGS)',
        debit: Number(cogsTotal.toFixed(3)),
        credit: 0
      },
      {
        account_code: '1040',
        account_name: 'Inventory Asset (Merchandise)',
        debit: 0,
        credit: Number(cogsTotal.toFixed(3))
      }
    ];

    const journalEntry: JournalEntry = {
      id: journalId,
      entry_no: `JRN-${new Date().getFullYear()}-${String(journalId).padStart(5, '0')}`,
      date: new Date().toISOString().slice(0, 10),
      reference_type: 'Sale',
      reference_id: invoice_no,
      description: `Double-entry posting for Tax Invoice ${invoice_no} (${invoice.customer})`,
      lines: journalLines,
      total_amount: Number((invoice.grand_total + cogsTotal).toFixed(3)),
      created_by: invoice.operator || 'admin'
    };

    this.journals.unshift(journalEntry);

    // Update branch sales
    const b = this.branches.find(br => br.name === invoice.branch);
    if (b) {
      b.salesToday += invoice.grand_total;
    }

    // Audio chime
    SoundEngine.cash();

    this.addNotification({
      title: `Tax Invoice ${invoice_no} Issued`,
      body: `Customer: ${invoice.customer} | Total: ${invoice.grand_total.toFixed(3)} ${this.config.currency} | Serial: ${sl_doc_no}`,
      type: 'sale'
    });

    this.logAudit(`Tax Invoice ${invoice_no} issued for ${invoice.grand_total.toFixed(3)} ${this.config.currency}`, 'invoice', invoice_no);
    this.persist();
    return invoice;
  }

  // --- Quotations Management ---
  public createQuotation(data: Partial<Quotation>): Quotation {
    const nextId = this.quotations.length ? Math.max(...this.quotations.map(q => q.id)) + 1 : 1;
    const quoteNo = data.quote_no || `${this.config.quotation_prefix}-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;
    const sl_doc_no = generateSlDocNo('SL-QT', nextId);
    const items = data.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = data.discount || 0;
    const taxable = Math.max(0, subtotal - discount);
    const vat = this.config.vatEnabled ? taxable * this.config.vatRate : 0;
    const grandTotal = taxable + vat;

    const newQuotation: Quotation = {
      id: nextId,
      quote_no: quoteNo,
      sl_doc_no,
      customer_id: data.customer_id,
      customer_name: data.customer_name || 'Walk-in Customer',
      customer_phone: data.customer_phone || '+968',
      customer_email: data.customer_email || '',
      date: data.date || new Date().toISOString().slice(0, 10),
      valid_until: data.valid_until || new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      items,
      subtotal,
      discount,
      vat,
      grand_total: grandTotal,
      status: data.status || 'Draft',
      notes: data.notes || '',
      terms: data.terms || 'Prices valid for 15 days in Sultanate of Oman. Subject to stock availability.'
    };

    this.quotations.unshift(newQuotation);
    this.logAudit(`Created Quotation ${newQuotation.quote_no} for ${newQuotation.customer_name}`, 'quotation', newQuotation.id);
    this.persist();
    return newQuotation;
  }

  public convertQuotationToInvoice(quoteId: number): Invoice | null {
    const quote = this.quotations.find(q => q.id === quoteId);
    if (!quote) return null;

    const costTotal = quote.items.reduce((sum, it) => sum + ((it.cost || it.price * 0.8) * it.qty), 0);
    const profit = Math.max(0, quote.subtotal - quote.discount - costTotal);

    const inv = this.createInvoice({
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer: quote.customer_name,
      customer_phone: quote.customer_phone,
      customer_id: quote.customer_id,
      items: quote.items.map(it => ({
        id: it.id,
        name: it.name,
        price: it.price,
        cost: it.cost || (it.price * 0.8),
        qty: it.qty,
        isComponent: it.isComponent,
        barcode: it.sku || generateEAN13(),
        imei: it.name.toLowerCase().includes('iphone') || it.name.toLowerCase().includes('galaxy') ? generateIMEI() : undefined,
        warranty: it.warranty || '1 Year Official Warranty'
      })),
      subtotal: quote.subtotal,
      discount: quote.discount,
      vat: quote.vat,
      vat_rate: this.config.vatRate,
      grand_total: quote.grand_total,
      paid: quote.grand_total,
      balance: 0,
      payment: 'Cash',
      profit,
      branch: 'Main Branch - Mabellah Sanaya',
      operator: 'admin',
      status: 'Paid',
      notes: `Converted from Quotation ${quote.quote_no}`
    });

    quote.status = 'Converted';
    this.logAudit(`Converted Quotation ${quote.quote_no} to Tax Invoice ${inv.invoice_no}`, 'invoice', inv.id);
    this.persist();
    return inv;
  }

  // --- Google Drive & Document Space Vault ---
  public addCloudFile(fileData: Partial<CloudDriveFile>): CloudDriveFile {
    const nextSeq = this.cloudFiles.length + 1;
    const sl_doc_no = fileData.sl_doc_no || generateSlDocNo('SL-DOC', nextSeq);
    const newFile: CloudDriveFile = {
      id: `doc-${Date.now()}`,
      sl_doc_no,
      fileName: fileData.fileName || 'Uploaded_Document.pdf',
      fileType: fileData.fileType || 'pdf',
      category: fileData.category || 'CR Legal',
      sizeBytes: fileData.sizeBytes || 1024 * 350,
      uploadDate: new Date().toISOString().slice(0, 10),
      uploadedBy: fileData.uploadedBy || 'admin',
      driveFolder: fileData.driveFolder || 'Documents_Vault',
      googleDriveSyncStatus: 'synced',
      googleDriveUrl: fileData.googleDriveUrl || `https://drive.google.com/drive/folders/${this.config.googleDrive.folderId}`,
      notes: fileData.notes || '',
      contentDataUri: fileData.contentDataUri
    };

    this.cloudFiles.unshift(newFile);
    this.config.googleDrive.totalSyncedFiles += 1;
    this.config.googleDrive.usedStorageBytes += newFile.sizeBytes;
    this.config.googleDrive.lastBackupTimestamp = new Date().toISOString();

    this.logAudit(`Uploaded document to Google Drive Space: ${newFile.fileName} (${sl_doc_no})`, 'drive', newFile.id);
    this.addNotification({
      title: `Document Uploaded to Cloud Space`,
      body: `${newFile.fileName} (SL: ${sl_doc_no}) synced with Google Drive.`,
      type: 'drive'
    });

    this.persist();
    return newFile;
  }

  public deleteCloudFile(id: string): boolean {
    const idx = this.cloudFiles.findIndex(f => f.id === id);
    if (idx === -1) return false;
    const [deleted] = this.cloudFiles.splice(idx, 1);
    this.config.googleDrive.totalSyncedFiles = Math.max(0, this.config.googleDrive.totalSyncedFiles - 1);
    this.config.googleDrive.usedStorageBytes = Math.max(0, this.config.googleDrive.usedStorageBytes - deleted.sizeBytes);
    this.logAudit(`Removed document from cloud space: ${deleted.fileName}`, 'drive', id);
    this.persist();
    return true;
  }

  // --- Cloud Backup Generation (Google Drive, GitHub Gist, MySQL Dump) ---
  public exportGoogleDriveBackupJson(): string {
    const backupObj = {
      version: '3.0.0-PROD',
      application: 'Top Telecom Oman & RST Electronics ERP Platform',
      jurisdiction: 'Sultanate of Oman (Tax Authority 5% VAT)',
      cr_no: this.config.cr_no,
      exportedAt: new Date().toISOString(),
      config: this.config,
      users: this.users,
      branches: this.branches,
      products: this.products,
      components: this.components,
      customers: this.customers,
      suppliers: this.suppliers,
      invoices: this.invoices,
      quotations: this.quotations,
      repairs: this.repairs,
      cctvProjects: this.cctvProjects,
      telecomOperators: this.telecomOperators,
      telecomTx: this.telecomTx,
      cloudFiles: this.cloudFiles,
      employees: this.employees,
      attendanceRecords: this.attendanceRecords,
      shifts: this.shifts,
      accounts: this.accounts,
      journals: this.journals
    };
    return JSON.stringify(backupObj, null, 2);
  }

  public exportGitHubGistFormat(): string {
    return JSON.stringify({
      description: `RST Enterprise Database Backup - ${this.config.business_name} - ${new Date().toISOString()}`,
      public: false,
      files: {
        'database_backup.json': {
          content: this.exportGoogleDriveBackupJson()
        },
        'schema_dump.sql': {
          content: this.generateSqlDump()
        }
      }
    }, null, 2);
  }

  public generateSqlDump(): string {
    let sql = `-- =========================================================\n`;
    sql += `-- TOP TELECOM OMAN & RST ELECTRONICS ERP - FULL SQL DUMP\n`;
    sql += `-- CR: ${this.config.cr_no} (Sultanate of Oman)\n`;
    sql += `-- Generated: ${new Date().toISOString()}\n`;
    sql += `-- Currency: OMR (DECIMAL 18,3) | VAT: 5.000%\n`;
    sql += `-- =========================================================\n\n`;

    sql += `CREATE DATABASE IF NOT EXISTS rst_electronics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE rst_electronics;\n\n`;

    // Users table
    sql += `DROP TABLE IF EXISTS users;\n`;
    sql += `CREATE TABLE users (id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(60) UNIQUE, fullname VARCHAR(150), role VARCHAR(30), branch INT, phone VARCHAR(50), email VARCHAR(100), active INT);\n`;
    this.users.forEach(u => {
      sql += `INSERT INTO users (id, username, fullname, role, branch, phone, email, active) VALUES (${u.id}, '${u.username}', '${u.fullname.replace(/'/g, "''")}', '${u.role}', ${u.branch}, '${u.phone || ''}', '${u.email || ''}', ${u.active ? 1 : 0});\n`;
    });

    // Products table
    sql += `\nDROP TABLE IF EXISTS products;\n`;
    sql += `CREATE TABLE products (id INT PRIMARY KEY AUTO_INCREMENT, sku VARCHAR(80) UNIQUE, name VARCHAR(255), brand VARCHAR(100), cost DECIMAL(18,3), price DECIMAL(18,3), stock INT, barcode VARCHAR(100), imei VARCHAR(80), serial VARCHAR(80));\n`;
    this.products.forEach(p => {
      sql += `INSERT INTO products (id, sku, name, brand, cost, price, stock, barcode, imei, serial) VALUES (${p.id}, '${p.sku}', '${p.name.replace(/'/g, "''")}', '${p.brand}', ${p.cost.toFixed(3)}, ${p.price.toFixed(3)}, ${p.stock}, '${p.barcode}', '${p.imei || ''}', '${p.serial || ''}');\n`;
    });

    // Invoices table
    sql += `\nDROP TABLE IF EXISTS sales;\n`;
    sql += `CREATE TABLE sales (id INT PRIMARY KEY AUTO_INCREMENT, invoice_no VARCHAR(60) UNIQUE, sl_doc_no VARCHAR(60), date VARCHAR(60), customer VARCHAR(150), subtotal DECIMAL(18,3), vat DECIMAL(18,3), grand_total DECIMAL(18,3), payment VARCHAR(50), profit DECIMAL(18,3));\n`;
    this.invoices.forEach(inv => {
      sql += `INSERT INTO sales (id, invoice_no, sl_doc_no, date, customer, subtotal, vat, grand_total, payment, profit) VALUES (${inv.id}, '${inv.invoice_no}', '${inv.sl_doc_no || ''}', '${inv.date}', '${inv.customer.replace(/'/g, "''")}', ${inv.subtotal.toFixed(3)}, ${inv.vat.toFixed(3)}, ${inv.grand_total.toFixed(3)}, '${inv.payment}', ${inv.profit.toFixed(3)});\n`;
    });

    return sql;
  }

  // --- Repair Jobs & Service Centre ---
  public createRepairJob(jobData: Partial<RepairJob>): RepairJob {
    const nextId = this.repairs.length ? Math.max(...this.repairs.map(r => r.id)) + 1 : 1;
    const job_card_no = `REP-${new Date().getFullYear()}-${String(nextId).padStart(4, '0')}`;
    const sl_doc_no = generateSlDocNo('SL-REP', nextId);

    const newJob: RepairJob = {
      id: nextId,
      job_card_no,
      sl_doc_no,
      customer_name: jobData.customer_name || 'Walk-in Customer',
      customer_phone: jobData.customer_phone || '+968',
      device_brand: jobData.device_brand || 'Smartphone',
      device_model: jobData.device_model || 'Standard Model',
      imei_or_serial: jobData.imei_or_serial || generateIMEI(),
      fault_reported: jobData.fault_reported || 'General diagnostic request',
      diagnosis: jobData.diagnosis || 'Pending inspection by senior technician',
      technician_assigned: jobData.technician_assigned || 'Eng. Tariq Al-Maawali',
      estimated_cost: jobData.estimated_cost || 15.000,
      parts_cost: jobData.parts_cost || 5.000,
      advance_paid: jobData.advance_paid || 0,
      balance_due: (jobData.estimated_cost || 15.000) - (jobData.advance_paid || 0),
      status: 'Pending',
      warranty_period: jobData.warranty_period || '90 Days Lab Warranty',
      date_received: new Date().toISOString().slice(0, 10),
      notes: jobData.notes || ''
    };

    this.repairs.unshift(newJob);
    this.logAudit(`Created Repair Job Card ${newJob.job_card_no} for ${newJob.customer_name}`, 'repair', newJob.id);
    this.persist();
    return newJob;
  }

  public updateRepairStatus(jobId: number, status: RepairJob['status']): RepairJob | null {
    const job = this.repairs.find(r => r.id === jobId);
    if (!job) return null;
    job.status = status;
    if (status === 'Delivered') {
      job.delivery_date = new Date().toISOString().slice(0, 10);
    }
    this.logAudit(`Repair Job ${job.job_card_no} status changed to ${status}`, 'repair', jobId);
    this.persist();
    return job;
  }

  // --- Telecom Recharge ---
  public rechargeTelecom(operatorId: number, amount: number, phone?: string): TelecomTransaction | null {
    const op = this.telecomOperators.find(o => o.id === operatorId);
    if (!op || op.balance < amount) return null;

    const profit = op.commissionType === 'fixed' 
      ? op.commissionValue 
      : (amount * op.commissionValue) / 100;

    const prevBal = op.balance;
    op.balance -= amount;

    const tx: TelecomTransaction = {
      id: Date.now(),
      operatorId: op.id,
      operatorName: op.name,
      phoneNumber: phone,
      amount,
      profit,
      previousBalance: prevBal,
      newBalance: op.balance,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString(),
      operator: 'admin'
    };

    this.telecomTx.unshift(tx);
    SoundEngine.beep();
    this.persist();
    return tx;
  }

  public addTelecomBalance(operatorId: number, amount: number) {
    const op = this.telecomOperators.find(o => o.id === operatorId);
    if (op) {
      op.balance += amount;
      this.persist();
    }
  }

  // --- Mobile Catalog to Inventory Import ---
  public addPhoneToInventory(
    device: PhoneDevice, 
    options?: { price?: number; cost?: number; stock?: number; warranty?: string }
  ): Product {
    const nextId = this.products.length ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const barcode = generateEAN13('890');
    const imei = generateIMEI('35');
    const imei2 = generateIMEI('86');
    const cleanBrand = device.brand_name || 'Generic';
    const estimatedPrice = options?.price || (device.priceEstimate || 120.000);
    const estimatedCost = options?.cost || (estimatedPrice * 0.82);

    const newProduct: Product = {
      id: nextId,
      sku: `PH-${cleanBrand.slice(0, 3).toUpperCase()}-${device.id}-${String(nextId).padStart(3, '0')}`,
      name: `${device.brand_name} ${device.name}`,
      brand: device.brand_name,
      category: 'Smartphones & Devices',
      cost: Number(estimatedCost.toFixed(3)),
      price: Number(estimatedPrice.toFixed(3)),
      wholesale: Number((estimatedPrice * 0.94).toFixed(3)),
      stock: options?.stock || 5,
      lowstock: 2,
      barcode,
      imei,
      imei2,
      serial: generateSerial('PHN'),
      condition: 'New',
      batteryHealth: 100,
      warranty: options?.warranty || '1 Year Official Warranty',
      unit: 'pcs',
      description: `Released: ${device.released_at || 'N/A'} | OS: ${device.os || 'N/A'} | Storage: ${device.storage || 'N/A'} | RAM: ${device.ram || 'N/A'} | Battery: ${device.battery || 'N/A'}`,
      image: device.picture,
      active: true,
      hasImei: true,
      isComponent: false,
      is_deleted: false
    };

    this.products.unshift(newProduct);
    this.logAudit(`Imported mobile phone to inventory: ${newProduct.name} (IMEI: ${imei})`, 'product', newProduct.sku);
    this.addNotification({
      title: `Mobile Phone Added: ${newProduct.name}`,
      body: `IMEI: ${imei} | Barcode: ${barcode} | Stock: ${newProduct.stock} units`,
      type: 'stock'
    });
    this.persist();
    return newProduct;
  }

  // --- Emergency Siren Controls ---
  public triggerEmergencyAlert(title: string, message: string, severity: EmergencyAlert['severity'] = 'critical') {
    this.activeEmergency = {
      id: Date.now(),
      active: true,
      title,
      message,
      type: 'emergency_siren',
      severity,
      timestamp: new Date().toLocaleTimeString()
    };
    this.persist();
    SoundEngine.playEmergencySiren(true);
    this.addNotification({
      title: `🚨 EMERGENCY ALERT: ${title}`,
      body: message,
      type: 'alert'
    });
    this.logAudit('EMERGENCY SIREN TRIGGERED: ' + title, 'alert', 'siren');
  }

  public stopEmergencyAlert(adminName: string) {
    if (this.activeEmergency) {
      this.activeEmergency.active = false;
      this.activeEmergency.stoppedBy = adminName;
    }
    SoundEngine.stopEmergencySiren();
    this.persist();
    this.logAudit(`EMERGENCY ALERT STOPPED BY ADMIN: ${adminName}`, 'alert', 'siren_stopped');
  }

  // --- Audit & Notifications ---
  public logAudit(action: string, targetType: string, targetId: any, user = 'admin', branch = 'Main Branch') {
    this.auditLogs.unshift({
      id: Date.now(),
      user,
      action,
      targetType,
      targetId,
      time: new Date().toLocaleTimeString(),
      branch
    });
    if (this.auditLogs.length > 500) this.auditLogs = this.auditLogs.slice(0, 500);
    this.persist();
  }

  public addNotification(n: { title: string; body: string; type: AppNotification['type'] }) {
    const newNotif: AppNotification = {
      id: Date.now(),
      title: n.title,
      body: n.body,
      type: n.type,
      time: new Date().toLocaleTimeString(),
      read: false
    };
    this.notifications.unshift(newNotif);
    if (this.notifications.length > 100) this.notifications = this.notifications.slice(0, 100);
    this.persist();
  }

  // --- Widget Pin / Unpin & Visibility ---
  public toggleWidget(widgetKey: string) {
    if (!this.config.widgetVisibility) this.config.widgetVisibility = {};
    this.config.widgetVisibility[widgetKey] = !this.config.widgetVisibility[widgetKey];
    this.persist();
  }

  public togglePinWidget(widgetKey: string) {
    if (!this.config.widgetPinned) this.config.widgetPinned = {};
    this.config.widgetPinned[widgetKey] = !this.config.widgetPinned[widgetKey];
    this.persist();
  }

  public restoreAllWidgets() {
    if (!this.config.widgetVisibility) this.config.widgetVisibility = {};
    Object.keys(this.config.widgetVisibility).forEach(k => {
      this.config.widgetVisibility[k] = true;
    });
    this.persist();
  }

  // --- User Account Management ---
  public createUser(userData: Partial<User>): User {
    const nextId = this.users.length ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const branchObj = this.branches.find(b => b.id === userData.branch) || this.branches[0];
    const newUser: User = {
      id: nextId,
      username: userData.username?.trim().toLowerCase() || `user_${nextId}`,
      password: userData.password || 'user123',
      fullname: userData.fullname || 'New Staff Member',
      role: userData.role || 'sales_staff',
      branch: userData.branch || (branchObj ? branchObj.id : 1),
      branchName: branchObj ? branchObj.name : 'Main Branch',
      phone: userData.phone || '+968',
      email: userData.email || '',
      profilePic: userData.profilePic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      active: userData.active !== false,
      permissions: userData.permissions || {
        canEditPrice: false,
        canViewProfit: false,
        canViewCostPrice: false,
        canTriggerEmergency: true,
        canStopEmergency: false,
        canRunSql: false,
        canManageUsers: false,
        canApprovePayroll: false,
        canDeleteInventory: false,
        canAccessSettings: false,
        canManageGoogleDrive: false,
        canIssueDiscounts: false,
        canProcessRefunds: false
      },
      hiddenPages: userData.hiddenPages || ['adminCenter', 'sqlStudio', 'accounting', 'googleDrive'],
      hiddenOptions: userData.hiddenOptions || {
        hideCostPrice: true,
        hideProfitMargin: true,
        hideSupplierBalances: true,
        hideFinancialSummary: true,
        hideDamagesCost: true,
        hidePayroll: true
      },
      createdAt: new Date().toISOString().slice(0, 10)
    };

    this.users.push(newUser);
    this.logAudit(`Created user account: ${newUser.username} (${newUser.role})`, 'users', newUser.id);
    this.persist();
    return newUser;
  }

  public updateUser(id: number, updates: Partial<User>): User | null {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    if (updates.branch) {
      const branchObj = this.branches.find(b => b.id === updates.branch);
      if (branchObj) updates.branchName = branchObj.name;
    }
    this.users[idx] = { ...this.users[idx], ...updates };
    this.logAudit(`Updated user account: ${this.users[idx].username}`, 'users', id);
    this.persist();
    return this.users[idx];
  }

  public deleteUser(id: number): boolean {
    if (id === 1) return false;
    const prevLen = this.users.length;
    this.users = this.users.filter(u => u.id !== id);
    if (this.users.length !== prevLen) {
      this.logAudit(`Deleted user account #${id}`, 'users', id);
      this.persist();
      return true;
    }
    return false;
  }

  public authenticate(username: string, password?: string): User | null {
    const u = this.users.find(user => 
      user.username.toLowerCase() === username.trim().toLowerCase() &&
      (!password || user.password === password) &&
      user.active !== false
    );
    if (u) {
      u.lastLogin = new Date().toISOString();
      this.persist();
    }
    return u || null;
  }

  // --- HRM Attendance Methods ---
  public checkInEmployee(
    employeeId: number,
    options?: { checkInTime?: string; notes?: string }
  ): AttendanceRecord | null {
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) return null;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = options?.checkInTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const existing = this.attendanceRecords.find(
      r => r.employeeId === employeeId && r.date === dateStr && !r.checkOutTime
    );
    if (existing) return existing;

    const nextId = this.attendanceRecords.length ? Math.max(...this.attendanceRecords.map(r => r.id)) + 1 : 1;
    const newRecord: AttendanceRecord = {
      id: nextId,
      employeeId: emp.id,
      employeeCode: emp.code,
      employeeName: emp.name,
      branch: emp.branch || 'Main Branch',
      date: dateStr,
      checkInTime: timeStr,
      breakMinutes: 60,
      totalHours: 0,
      overtimeHours: 0,
      shiftCategory: emp.shiftCategory || 'Morning Shift',
      status: 'Checked In',
      hourlyRate: emp.hourlyRate || 3.000,
      calculatedPay: 0,
      isApproved: false,
      notes: options?.notes || `Staff clocked in at ${timeStr}`
    };

    this.attendanceRecords.unshift(newRecord);
    this.logAudit(`Employee Clock-In: ${emp.name} (${timeStr})`, 'attendance', newRecord.id);
    this.persist();
    return newRecord;
  }

  public checkOutEmployee(
    recordId: number,
    options?: { checkOutTime?: string; notes?: string }
  ): AttendanceRecord | null {
    const record = this.attendanceRecords.find(r => r.id === recordId);
    if (!record) return null;

    const now = new Date();
    const timeStr = options?.checkOutTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // Calculate hours
    const parseToMin = (t: string) => {
      const parts = t.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
    };

    const inMin = parseToMin(record.checkInTime);
    let outMin = parseToMin(timeStr);
    if (outMin < inMin) outMin += 24 * 60;

    const totalMin = Math.max(0, outMin - inMin - record.breakMinutes);
    const totalHours = Math.round((totalMin / 60) * 100) / 100;
    const overtimeHours = totalHours > 8 ? Math.round((totalHours - 8) * 100) / 100 : 0;
    const calculatedPay = Number(((totalHours * record.hourlyRate) + (overtimeHours * record.hourlyRate * 0.5)).toFixed(3));

    record.checkOutTime = timeStr;
    record.totalHours = totalHours;
    record.overtimeHours = overtimeHours;
    record.calculatedPay = calculatedPay;
    record.status = overtimeHours > 0 ? 'Overtime' : 'Completed';

    this.logAudit(`Employee Clock-Out: ${record.employeeName} (${totalHours} hrs)`, 'attendance', record.id);
    this.persist();
    return record;
  }

  public approveAttendanceRecord(id: number, approverName = 'Administrator') {
    const rec = this.attendanceRecords.find(r => r.id === id);
    if (rec) {
      rec.isApproved = true;
      rec.approvedBy = approverName;
      this.logAudit(`Approved attendance payroll for #${id} (${rec.employeeName})`, 'payroll', id);
      this.persist();
    }
  }

  public saveConfig(newConfig: BusinessConfig) {
    this.config = { ...newConfig };
    this.persist();
  }
}

export const db = new DatabaseManager();
