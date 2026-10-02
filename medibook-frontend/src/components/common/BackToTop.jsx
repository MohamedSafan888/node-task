import { useState, useEffect } from 'react'
import { Fab, Zoom, Tooltip } from '@mui/material'
import { KeyboardArrowUpOutlined } from '@mui/icons-material'

export default function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <Zoom in={show}>
      <Tooltip title="Back to top">
        <Fab size="small" color="primary"
          onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          sx={{position:'fixed',bottom:24,right:24,zIndex:1200}}>
          <KeyboardArrowUpOutlined/>
        </Fab>
      </Tooltip>
    </Zoom>
  )
}
