<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-section">
        <img src="/images/PORTAL.jpg" alt="Portal" class="logo" />
        <h1 class="title">Portal</h1>
      </div>
      
      <div v-if="showSuccess" class="success-message">
        OK
      </div>
      
      <form v-else @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">ユーザ名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            :disabled="isLoading"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">パスワード</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            :disabled="isLoading"
            class="form-input"
          />
        </div>
        
        <button
          type="submit"
          :disabled="isLoading"
          class="login-button"
        >
          {{ isLoading ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Telegram } from '../../comlibs/telegram-common'
import { Verify } from '../../comlibs/ssm'
import { API_BASE_URL } from '@/config/urls'

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const showSuccess = ref(false)

interface PreRequest {
  [key: string]: string | number | boolean
  USER: string
}

interface PreResponse {
  RESULT: boolean
  DETAIL?: string
  MAGIC_NUMBER?: number
}

interface UnlockRequest {
  [key: string]: string | number | boolean
  USER: string
  MAGIC_NUMBER: number
  HASH_PASS: string
}

interface UnlockResponse {
  RESULT: boolean
  DETAIL?: string
  SEQ_NUMBER?: number
}

const handleLogin = async () => {
  if (!username.value || !password.value) {
    alert('ユーザ名とパスワードを入力してください')
    return
  }

  isLoading.value = true

  try {
    // プレ要求を送信
    const preRequest: PreRequest = {
      USER: username.value
    }

    await Telegram.post(
      `${API_BASE_URL}/api/pre`,
      preRequest,
      (reply: string) => {
        try {
          const preResponse: PreResponse = JSON.parse(reply)
          
          if (!preResponse.RESULT) {
            isLoading.value = false
            alert(preResponse.DETAIL || 'ログインに失敗しました')
            return
          }

          if (preResponse.MAGIC_NUMBER === undefined) {
            isLoading.value = false
            alert('マジックナンバが受信できませんでした')
            return
          }

          // 開錠要求を送信
          const hashPass = Verify.calc_hash(preResponse.MAGIC_NUMBER, password.value)
          const unlockRequest: UnlockRequest = {
            USER: username.value,
            MAGIC_NUMBER: preResponse.MAGIC_NUMBER,
            HASH_PASS: hashPass
          }

          Telegram.post(
            `${API_BASE_URL}/api/unlock`,
            unlockRequest,
            (reply: string) => {
              try {
                const unlockResponse: UnlockResponse = JSON.parse(reply)
                
                if (!unlockResponse.RESULT) {
                  isLoading.value = false
                  alert(unlockResponse.DETAIL || 'ログインに失敗しました')
                  return
                }

                if (unlockResponse.SEQ_NUMBER === undefined) {
                  isLoading.value = false
                  alert('シーケンスナンバが受信できませんでした')
                  return
                }

                // セッション情報を更新
                Verify.update({
                  user: username.value,
                  sequence: unlockResponse.SEQ_NUMBER
                })

                // 成功メッセージを表示
                isLoading.value = false
                showSuccess.value = true
              } catch (e) {
                isLoading.value = false
                alert(`応答の解析に失敗しました: ${e}`)
              }
            },
            (error: string) => {
              isLoading.value = false
              alert(`開錠要求エラー: ${error}`)
            }
          )
        } catch (e) {
          isLoading.value = false
          alert(`応答の解析に失敗しました: ${e}`)
        }
      },
      (error: string) => {
        isLoading.value = false
        alert(`プレ要求エラー: ${error}`)
      }
    )
  } catch (e) {
    isLoading.value = false
    alert(`ログイン処理中にエラーが発生しました: ${e}`)
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  max-width: 120px;
  height: auto;
  margin-bottom: 15px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.login-button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #4caf50;
  padding: 40px 20px;
}

/* スマホ対応 */
@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }

  .title {
    font-size: 28px;
  }

  .logo {
    max-width: 100px;
  }
}
</style>

