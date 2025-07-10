// 钱包连接工具函数
export const getEthereumProvider = () => {
  if (typeof window === 'undefined') return null
  
  // 安全地获取 ethereum 对象
  try {
    // 优先使用 window.ethereum
    if (window.ethereum) {
      return window.ethereum
    }
    
    // 检查是否有 MetaMask 特定的提供者
    if (window.web3 && window.web3.currentProvider) {
      return window.web3.currentProvider
    }
    
    return null
  } catch (error) {
    console.warn('获取以太坊提供者时出错:', error)
    return null
  }
}

export const checkWalletConnection = async () => {
  const provider = getEthereumProvider()
  if (!provider) return { connected: false, accounts: [] }
  
  try {
    const accounts = await provider.request({ method: 'eth_accounts' })
    return {
      connected: accounts.length > 0,
      accounts: accounts
    }
  } catch (error) {
    console.error('检查钱包连接状态失败:', error)
    return { connected: false, accounts: [] }
  }
}

export const connectWallet = async () => {
  const provider = getEthereumProvider()
  
  if (!provider) {
    throw new Error('请安装MetaMask或其他Web3钱包')
  }
  
  try {
    const accounts = await provider.request({ 
      method: 'eth_requestAccounts' 
    })
    
    if (accounts.length === 0) {
      throw new Error('未获取到钱包账户')
    }
    
    return {
      success: true,
      accounts: accounts,
      address: accounts[0]
    }
  } catch (error) {
    console.error('连接钱包失败:', error)
    
    // 处理用户拒绝连接的情况
    if (error.code === 4001) {
      throw new Error('用户拒绝连接钱包')
    }
    
    throw new Error('连接钱包失败，请重试')
  }
}

export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const switchToMainnet = async () => {
  const provider = getEthereumProvider()
  if (!provider) return false
  
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // 主网
    })
    return true
  } catch (error) {
    console.error('切换到主网失败:', error)
    return false
  }
}

export const addTokenToWallet = async (tokenAddress, tokenSymbol, tokenDecimals = 18) => {
  const provider = getEthereumProvider()
  if (!provider) return false
  
  try {
    await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
        },
      },
    })
    return true
  } catch (error) {
    console.error('添加代币到钱包失败:', error)
    return false
  }
} 