/**
 * サイトのベースURLとAPI用のベースURLを保持する設定ファイル
 */

// 開発環境かどうかを判定（本番環境では環境変数で制御可能）
const isDevelopment = import.meta.env.DEV

// サイトのベースURL
export const BASE_URL = '/portal'

// API用のベースURL
// 開発環境: localhost:8000
// 本番環境: 環境変数またはデフォルト値を使用
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000'
  : (import.meta.env.VITE_API_BASE_URL || '')

