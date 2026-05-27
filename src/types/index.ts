export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedItems<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  avatar: string;
  level: number;
  title: string | null;
  role: number;
  status: number;
  discount_percent: number;
  count_order: number;
  total_sales: string;
  personal_order_quantity_month: number;
  personal_sales_month: string;
  personal_count_order_month: number;
  inviter_username: string;
  created_at: number;
  address: string;
  gender: number;
  dob: string;
  bank_name: string;
  bank_address: string;
  bank_number: string;
  bank_owner: string;
  point: number;
  usd_balance: string;
  bonus_balance: string;
  total_bonus: string;
  total_invest: string;
  personal_sales: string;
  system_sales: string;
  total_withdraw: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export interface Notification {
  id: number;
  user_id: number | null;
  title: string;
  message: string;
  type: string;
  status: number;
  created_at: number;
  css_class: string;
  image: string;
  read_at: string | null;
  is_read: boolean;
}

export interface NotificationsData {
  notifications: Notification[];
  unread_count: number;
  total?: number;
  page?: number;
  limit?: number;
}

export interface Promotion {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  category_label: string;
  created_at: number;
  updated_at: number;
}

export interface DashboardData {
  totalProtandim: number;
  totalImmucan: number;
  totalKiddy: number;
  totalCoffee: number;
  totalFucoidan: number;
  totalNuoc: number;
  totalTaodo: number;
  totalProvegan: number;
  totalKiddyBox: number;
  totalCoffeeBox: number;
  totalFucoidanBox: number;
  totalNuocBox: number;
  totalTaodoBox: number;
  totalDoanhSo: number;
  totalAmount: number;
  userFund: {
    total_personal_quantity: number;
    total_system_quantity: number;
    total_quantity: number;
    fund_travel: number;
    fund_reward: number;
    fund_community: number;
    total_fund: number;
    paid_travel: number;
    paid_reward: number;
    paid_community: number;
    paid_total: number;
    remain_travel: number;
    remain_reward: number;
    remain_community: number;
    remain_total: number;
  };
}

export interface Banner {
  id: number;
  title: string;
  content: string;
  image: string;
  link: string;
  sort_order: number;
  start_at: number | null;
  end_at: number | null;
}

export interface Profile {
  avatar: string;
  fullname: string;
  username: string;
  phone: string;
  email: string;
  inviter_username: string;
  level: number;
  role: number;
  status: number;
  address: string;
  gender: number;
  dob: string;
  bank_name: string;
  bank_number: string;
  bank_owner: string;
  point: number;
  created_at: number;
}

export interface CompetitionItem {
  id: number;
  username: string;
  system_order_quantity_month: number;
  avatar: string;
  rank: number;
}

export interface CompetitionData {
  total: number;
  limit: number;
  offset: number;
  items: CompetitionItem[];
}
