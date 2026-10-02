export const formatDate = (d, locale='en') =>
  d ? new Date(d).toLocaleDateString(locale==='ar'?'ar-EG':'en-US',{year:'numeric',month:'long',day:'numeric'}) : ''

export const formatTime = (d, locale='en') =>
  d ? new Date(d).toLocaleTimeString(locale==='ar'?'ar-EG':'en-US',{hour:'2-digit',minute:'2-digit'}) : ''

export const capitalise = (s='') => s.charAt(0).toUpperCase()+s.slice(1)

export const getInitials = (name='') =>
  name.split(' ').filter(Boolean).slice(0,2).map(n=>n[0].toUpperCase()).join('')

export const buildQuery = (p={}) =>
  Object.entries(p).filter(([,v])=>v!==undefined&&v!==null&&v!=='')
    .map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')

export const isEmpty = (v) => v===undefined||v===null||String(v).trim()===''

export const statusColor = (status) => {
  const map = { pending:'warning', approved:'success', completed:'info', rejected:'error', cancelled:'default' }
  return map[status] || 'default'
}
