import { defineStore } from 'pinia'

export const useChatHistoryStore = defineStore('chatHistory', {
  state: () => ({
    chatHistory: [
      {
        prompt: 'Login Page Architecture\nThe Login Page allows users to authenticate securely using their credentials. It supports both email/password authentication and optional third-party OAuth providers (e.g., Google).\n\n2. UI Elements\n\nEmail input field\n\nPassword input field\n\n"Login" button\n\n"Forgot Password?" link\n\nOptional: "Login with Google" button\n\nValidation error messages\n\n3. Frontend (Client-Side)\n\nFramework: React/Vue/HTML\n\nValidation:\n\nEmail format check\n\nPassword required (min length, if enforced)\n\nSecurity:\n\nInputs masked for password\n\nDebounced form submission\n\nCSRF token (if applicable)\n\n4. Backend (Server-Side)\n\nRoute: POST /api/login\n\nValidations:\n\nCheck email and password against database\n\nRate limiting to prevent brute-force attacks\n\nResponse:\n\nOn success: return JWT/session token and user info\n\nOn failure: return error message (e.g., "Invalid credentials")',
        blockDiagCode: 'digraph {\n\trankdir=LR;\n\tnode [shape=box];\n\tLogin_Page [label="Login Page"];\n\tUI_Elements [label="UI Elements"];\n\tFrontend [label="Frontend (Client-Side)"];\n\tBackend [label="Backend (Server-Side)"];\n\n\tLogin_Page -> UI_Elements;\n\tLogin_Page -> Frontend;\n\tLogin_Page -> Backend;\n\n\tsubgraph cluster_UI {\n\t\tlabel = "UI Elements";\n\t\tEmail_Input [label="Email input field"];\n\t\tPassword_Input [label="Password input field"];\n\t\tLogin_Button [label="Login button"];\n\t\tForgot_Password [label="Forgot Password? link"];\n\t\tLogin_with_Google [label="Login with Google button", shape=diamond];\n\t\tValidation_Error [label="Validation error messages"];\n\n\t\tEmail_Input -> Login_Button;\n\t\tPassword_Input -> Login_Button;\n\t\tLogin_Button -> Forgot_Password;\n\t\tLogin_Button -> Login_with_Google;\n\t\tLogin_Button -> Validation_Error;\n\t}\n\n\tsubgraph cluster_Frontend {\n\t\tlabel = "Frontend (Client-Side)";\n\t\tFramework [label="React/Vue/HTML"];\n\t\tValidation [label="Validation"];\n\t\tSecurity [label="Security"];\n\n\t\tFramework -> Validation;\n\t\tFramework -> Security;\n\n\t\tEmail_Format [label="Email format check", shape=oval];\n\t\tPassword_Required [label="Password required", shape=oval];\n\t\tInputs_Masked [label="Inputs masked"];\n\t\tDebounced_Submission [label="Debounced form submission"];\n\t\tCSRF_Token [label="CSRF token", shape=diamond];\n\n\t\tValidation -> Email_Format;\n\t\tValidation -> Password_Required;\n\t\tSecurity -> Inputs_Masked;\n\t\tSecurity -> Debounced_Submission;\n\t\tSecurity -> CSRF_Token;\n\t}\n\n\tsubgraph cluster_Backend {\n\t\tlabel = "Backend (Server-Side)";\n\t\tRoute [label="POST /api/login"];\n\t\tValidations [label="Validations"];\n\t\tResponse [label="Response"];\n\n\t\tRoute -> Validations;\n\t\tRoute -> Response;\n\n\t\tCheck_Credentials [label="Check email and password", shape=oval];\n\t\tRate_Limiting [label="Rate limiting"];\n\t\tSuccess_Response [label="JWT/session token & user info", shape=note];\n\t\tFailure_Response [label="Error message", shape=note];\n\n\t\tValidations -> Check_Credentials;\n\t\tValidations -> Rate_Limiting;\n\t\tResponse -> Success_Response;\n\t\tResponse -> Failure_Response;\n\t}\n}',
      },
    ],
    currentChatIndex: 0,
  }),
  actions: {
    addChat(chat) {
      this.chatHistory.push(chat)
      this.currentChatIndex = this.chatHistory.length - 1
    },
    updateChat(index, updatedChat) {
      this.chatHistory[index] = updatedChat
    },
    clearChat() {
      this.chatHistory = []
      this.currentChatIndex = 0
    },
    setCurrentChatIndex(index) {
      if (index >= 0 && index < this.chatHistory.length) {
        this.currentChatIndex = index
      }
    },
  },
  persist: true,
})
