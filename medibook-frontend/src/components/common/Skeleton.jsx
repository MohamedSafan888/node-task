import { Skeleton as MuiSkeleton, Box, Grid } from '@mui/material'
export function CardSkeleton() {
  return <MuiSkeleton variant="rectangular" height={220} sx={{borderRadius:2}}/>
}
export function ListSkeleton({ rows = 4 }) {
  return (
    <Box>
      {[...Array(rows)].map((_,i)=>(
        <Box key={i} sx={{display:'flex',gap:2,mb:2,alignItems:'center'}}>
          <MuiSkeleton variant="circular" width={44} height={44}/>
          <Box sx={{flex:1}}>
            <MuiSkeleton width="60%" height={20} sx={{mb:.5}}/>
            <MuiSkeleton width="40%" height={16}/>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
export function DoctorGridSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_,i)=>(
        <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
          <CardSkeleton/>
        </Grid>
      ))}
    </Grid>
  )
}
