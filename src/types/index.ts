export type Language = 'en' | 'bn' | 'ar';

export type UserRole = 
  | 'master_admin'
  | 'admin'
  | 'manager'
  | 'cashier'
  | 'accountant'
  | 'service_technician'
  | 'storekeeper'
  | 'hr_officer'
  | 'sales_staff'
  | 'auditor';

export interface UserPermissions {
  canEditPrice: boolean;
  canViewProfit: boolean;
  canViewCostPrice: boolean;
  canTriggerEmergency: boolean;
  canStopEmergency: boolean;
  canRunSql: boolean;
  canManageUsers: boolean;
  canApprovePayroll: boolean;
  canDeleteInventory: boolean;
  canAccessSettings: boolean;
  canManageGoogleDrive: boolean;
  canIssueDiscounts: boolean;
  canProcessRefunds: boolean;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  fullname: string;
  role: UserRole;
  branch: number;
  branchName?: string;
  phone?: string;
  email?: string;
  profilePic?: string;
  signatureUrl?: string;
  active?: boolean;
  permissions: UserPermissions;
  hiddenPages?: string[];
  hiddenOptions?: {
    hideCostPrice?: boolean;
    hideProfitMargin?: boolean;
    hideSupplierBalances?: boolean;
    hideFinancialSummary?: boolean;
    hideDamagesCost?: boolean;
    hidePayroll?: boolean;
  };
  createdAt?: string;
  lastLogin?: string;
}

export type ComponentCategory = 
  | 'Microcontrollers'
  | 'Integrated Circuits'
  | 'Sensors'
  | 'Displays'
  | 'Power & Batteries'
  | 'Passive Components'
  | 'Wireless & Modules'
  | 'Relays & Switches'
  | 'Connectors & Cables'
  | 'Tools & Soldering'
  | 'Mobile Electronics'
  | 'CCTV & Accessories';

export interface ElectronicComponent {
  id: number;
  sku: string;
  name: string;
  category: ComponentCategory;
  subcategory: string;
  packageType: string;
  voltage: string;
  specs: Record<string, string>;
  pinoutSummary?: string;
  description: string;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  barcode: string;
  datasheetUrl?: string;
  isPopular?: boolean;
  tags: string[];
}

export type DeviceCondition = 'New' | 'Used' | 'Refurbished';

export interface Product {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  cost: number;
  price: number;
  wholesale?: number;
  stock: number;
  lowstock?: number;
  barcode: string;
  imei?: string;
  imei2?: string;
  serial?: string;
  condition?: DeviceCondition;
  batteryHealth?: number;
  color?: string;
  storage?: string;
  ram?: string;
  warranty?: string;
  unit: string;
  description?: string;
  image?: string;
  active: boolean;
  hasImei?: boolean;
  isComponent?: boolean;
  is_deleted: boolean;
  warehouseId?: number;
  branchId?: number;
}

export interface PhoneBrand {
  id: number;
  name: string;
  logo?: string;
  device_count: number;
  num_devices?: number;
}

export interface PhoneDevice {
  id: number;
  brand_id: number;
  brand_name: string;
  name: string;
  device_name?: string;
  picture?: string;
  device_image?: string;
  released_at?: string;
  release_date?: string;
  os?: string;
  storage?: string;
  ram?: string;
  display?: string;
  display_size?: string;
  display_resolution?: string;
  battery?: string;
  chipset?: string;
  camera_spec?: string;
  device_type?: string;
  priceEstimate?: number;
}

export interface CartItem {
  id: number;
  name: string;
  sku?: string;
  price: number;
  cost: number;
  qty: number;
  isComponent?: boolean;
  barcode?: string;
  imei?: string;
  imei2?: string;
  serial?: string;
  warranty?: string;
  hasInstallationService?: boolean;
  installationFee?: number;
  installationAdvancedPaid?: number;
  installationDueOnCompletion?: number;
  installationNotes?: string;
}

export type PaymentMethod = 'Cash' | 'Card' | 'Bank' | 'Due' | 'Split';

export interface Invoice {
  id: number;
  invoice_no: string;
  sl_doc_no?: string;
  date: string;
  customer: string;
  customer_phone?: string;
  customer_id?: number;
  customer_cr?: string;
  customer_vat?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  vat: number;
  vat_rate: number;
  grand_total: number;
  paid: number;
  balance: number;
  payment: PaymentMethod;
  amountReceivedCash?: number;
  amountReceivedBankSwift?: number;
  amountReceivedBankTransfer?: number;
  amountCreditLedger?: number;
  bankSwiftMachineNo?: string;
  bankTransferRefNo?: string;
  hasServiceInstallation?: boolean;
  serviceAdvancedPaid?: number;
  serviceDueOnCompletion?: number;
  serviceWorkStatus?: 'Pending' | 'In Progress' | 'Completed';
  serviceNotes?: string;
  profit: number;
  branch: string;
  branch_id?: number;
  operator: string;
  status: 'Paid' | 'Due' | 'Refunded' | 'Cancelled';
  notes?: string;
  qrCodeData?: string;
}

export interface QuotationItem {
  id: number;
  name: string;
  sku?: string;
  price: number;
  cost?: number;
  qty: number;
  isComponent?: boolean;
  imei?: string;
  warranty?: string;
}

export interface Quotation {
  id: number;
  quote_no: string;
  sl_doc_no?: string;
  customer_id?: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  date: string;
  valid_until: string;
  items: QuotationItem[];
  subtotal: number;
  discount: number;
  vat: number;
  grand_total: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Converted' | 'Expired';
  notes?: string;
  terms?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  cr_no?: string;
  vat_no?: string;
  balance: number;
  credit_limit?: number;
  creditDays?: number;
  isVip?: boolean;
  loyaltyPoints?: number;
  loyaltyTier?: 'Gold' | 'Silver' | 'Bronze';
  is_deleted: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  address: string;
  cr_no?: string;
  vat_no?: string;
  balance: number;
  created_at: string;
}

export interface PurchaseItem {
  id: number;
  name: string;
  sku?: string;
  cost: number;
  qty: number;
  line_total: number;
}

export interface Purchase {
  id: number;
  purchase_no: string;
  sl_doc_no?: string;
  supplier_id: number;
  supplier_name: string;
  date: string;
  items: PurchaseItem[];
  subtotal: number;
  vat: number;
  grand_total: number;
  paid: number;
  balance: number;
  status: 'Draft' | 'Posted' | 'Paid' | 'Partial' | 'Cancelled';
  notes?: string;
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  payment_method: 'Cash' | 'Bank' | 'Card';
  expense_date: string;
  recorded_by: string;
  branch: string;
  note?: string;
  receipt_doc_no?: string;
}

export interface Account {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface JournalEntry {
  id: number;
  entry_no: string;
  date: string;
  reference_type: 'Sale' | 'Purchase' | 'Expense' | 'Repair' | 'Manual';
  reference_id: string;
  description: string;
  lines: {
    account_code: string;
    account_name: string;
    debit: number;
    credit: number;
  }[];
  total_amount: number;
  created_by: string;
}

export type RepairStatus = 
  | 'Pending'
  | 'Diagnosed'
  | 'Waiting Parts'
  | 'In Progress'
  | 'Quality Check'
  | 'Delivered'
  | 'Cancelled';

export interface RepairJob {
  id: number;
  job_card_no: string;
  sl_doc_no: string;
  customer_name: string;
  customer_phone: string;
  device_brand: string;
  device_model: string;
  imei_or_serial: string;
  fault_reported: string;
  diagnosis?: string;
  technician_assigned: string;
  estimated_cost: number;
  parts_cost: number;
  advance_paid: number;
  balance_due: number;
  status: RepairStatus;
  warranty_period: string;
  date_received: string;
  delivery_date?: string;
  notes?: string;
}

export interface CctvProject {
  id: number;
  project_no: string;
  sl_doc_no: string;
  client_name: string;
  client_phone: string;
  site_address: string;
  camera_count: number;
  dvr_nvr_model: string;
  hdd_capacity: string;
  total_value: number;
  advance_paid: number;
  balance_due: number;
  lead_technician: string;
  installation_date: string;
  status: 'Survey' | 'Quoted' | 'In Progress' | 'Testing' | 'Handed Over';
  notes?: string;
}

export interface TelecomOperator {
  id: number;
  name: string;
  code: string;
  color: string;
  balance: number;
  commissionType: 'percent' | 'fixed';
  commissionValue: number;
  lowAlertThreshold: number;
  is_active: boolean;
}

export interface TelecomTransaction {
  id: number;
  operatorId: number;
  operatorName: string;
  phoneNumber?: string;
  amount: number;
  profit: number;
  previousBalance: number;
  newBalance: number;
  date: string;
  time: string;
  operator: string;
}

export interface Employee {
  id: number;
  code: string;
  name: string;
  designation: string;
  department: string;
  shiftCategory: string;
  hourlyRate: number;
  phone: string;
  email?: string;
  branch: string;
  status: 'Active' | 'On Leave' | 'Terminated';
}

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  branch: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  breakMinutes: number;
  totalHours: number;
  overtimeHours: number;
  shiftCategory: string;
  status: 'Checked In' | 'Completed' | 'Late' | 'Half Day' | 'Overtime';
  hourlyRate: number;
  calculatedPay: number;
  isApproved: boolean;
  approvedBy?: string;
  notes?: string;
}

export interface AttendanceShiftCategory {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  standardHours: number;
  defaultBreakMinutes: number;
  overtimeThresholdHours: number;
  overtimeRateMultiplier: number;
  color: string;
}

export interface CloudDriveFile {
  id: string;
  sl_doc_no: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'sheet' | 'contract' | 'archive' | 'backup';
  category: 'Tax Filing' | 'CR Legal' | 'Invoices' | 'Warranties' | 'Suppliers' | 'Device Specs' | 'Cloud Backup';
  sizeBytes: number;
  uploadDate: string;
  uploadedBy: string;
  driveFolder: string;
  googleDriveSyncStatus: 'synced' | 'local_only' | 'pending';
  googleDriveUrl?: string;
  notes?: string;
  contentDataUri?: string;
}

export interface GoogleDriveConfig {
  connected: boolean;
  accountEmail: string;
  folderName: string;
  folderId: string;
  autoBackupDaily: boolean;
  lastBackupTimestamp?: string;
  totalSyncedFiles: number;
  usedStorageBytes: number;
  maxStorageBytes: number;
}

export interface DocumentSequence {
  prefix: string;
  nextNumber: number;
  padding: number;
  description: string;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  salesToday: number;
  is_active: boolean;
}

export interface LoyaltyCard {
  id: number;
  code: string;
  type: 'Discount' | 'Membership' | 'Gift';
  value: number;
  discountType: 'percent' | 'fixed';
  customerName?: string;
  expiresAt: string;
  status: 'Active' | 'Used' | 'Expired';
}

export interface DamageEntry {
  id: number;
  date: string;
  itemName: string;
  sku?: string;
  qty: number;
  costLost: number;
  reason: string;
  recordedBy: string;
}

export interface EmergencyAlert {
  id: number;
  active: boolean;
  title: string;
  message: string;
  type: 'emergency_siren' | 'gemini_ai' | 'credit_alert' | 'low_stock' | 'branch_alert';
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  stoppedBy?: string;
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  targetType: string;
  targetId: any;
  time: string;
  branch?: string;
}

export interface AppNotification {
  id: number;
  title: string;
  body: string;
  type: 'sale' | 'stock' | 'system' | 'telecom' | 'alert' | 'drive';
  time: string;
  read: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
  readTime: string;
  published: boolean;
}

export interface LandingPageConfig {
  domainName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  heroBadge: string;
  aboutText: string;
  servicesHighlights: { title: string; desc: string; icon: string }[];
  portfolioStats: { label: string; value: string }[];
  companyHighlights: string[];
  contactWhatsapp: string;
  contactAddress: string;
  contactEmail: string;
  enableVisitorShowcase: boolean;
  hidePricesInShowcase: boolean;
  featuredModelIds: number[];
  blogPosts: BlogPost[];
}

export type ThemePreset = 'emerald' | 'obsidian' | 'sapphire' | 'amethyst' | 'solar' | 'cyberpunk';
export type AnimationLevel = 'smooth' | 'high_fps' | 'reduced' | 'pulse';

export interface BusinessConfig {
  business_name: string;
  legal_name: string;
  cr_no: string;
  tax_no?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  currency: string;
  currency_symbol: string;
  vatRate: number;
  vatEnabled: boolean;
  decimalPlaces: number;
  invoice_prefix: string;
  quotation_prefix: string;
  sl_doc_prefix: string;
  lowStockAlert: number;
  telecomLowBalanceAlert: number;
  themePreset: ThemePreset;
  animationLevel: AnimationLevel;
  fontScale: 'compact' | 'normal' | 'spacious';
  tableDensity: 'tight' | 'balanced' | 'relaxed';
  hideProfitInPOS: boolean;
  hideCostPriceInPOS: boolean;
  requireImeiForMobile: boolean;
  soundAlerts: {
    enabled: boolean;
    volume: number;
    siren: boolean;
    cashRegister: boolean;
    scannerBeep: boolean;
    buttonClick: boolean;
  };
  voiceControl: {
    enabled: boolean;
    speechOutput: boolean;
    preferredVoiceLang: string;
  };
  creditAlertThresholdDays: number;
  widgetVisibility: Record<string, boolean>;
  widgetPinned: Record<string, boolean>;
  googleDrive: GoogleDriveConfig;
  landingPage: LandingPageConfig;
}
