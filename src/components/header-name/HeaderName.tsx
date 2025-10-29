import React from 'react'
import { Breadcrumbs, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface HeaderNameProps {
  header: string;
  breadcrumbPaths?: string;
}

const HeaderName: React.FC<HeaderNameProps> = ({header, breadcrumbPaths}) => {
  return (
    <div>
      <Breadcrumbs 
        separator={
          <ArrowForwardIosIcon fontSize="small" sx={{color: "#0D3063"}} />
        }
      >
        <Typography variant='h5' color={breadcrumbPaths ? "#0D3063" : "white"} sx={{ fontWeight: 600, fontSize: "24px" }}>{header}</Typography>
        {
          breadcrumbPaths && (
            <Typography variant='h5' color="#006FFD" sx={{ fontWeight: 600, fontSize: "24px" }}>{breadcrumbPaths}</Typography>
          )
        }
      </Breadcrumbs>
    </div>
  )
}

export default HeaderName;