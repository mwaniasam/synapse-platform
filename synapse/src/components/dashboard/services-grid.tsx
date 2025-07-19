"use client"

import * as React from 'react';
import { useRouter } from "next/navigation"
import { Card, CardContent, Typography, Box, Grid, useTheme } from "@mui/material"
import { servicesConfig, ServiceConfig } from "@/config/services.config"

export function ServicesGrid() {
  const router = useRouter()
  const theme = useTheme()
  
  // Debug log to check services configuration
  React.useEffect(() => {
    console.log('Services Config:', servicesConfig);
  }, []);
  
  // Group services by category
  const servicesByCategory = React.useMemo(() => {
    const result = servicesConfig.reduce<Record<string, ServiceConfig[]>>((acc, service: ServiceConfig) => {
      if (!service.enabled) return acc;
      
      const category = service.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {});
    
    console.log('Grouped Services:', result);
    return result;
  }, [servicesConfig]);

  // Capitalize first letter of category name
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Available Services
      </Typography>
      
      {Object.entries(servicesByCategory).map(([category, services]) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography 
            variant="subtitle1" 
            component="h3" 
            sx={{ 
              mb: 2, 
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'capitalize',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box component="span" sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: theme.palette.primary.main 
            }} />
            {formatCategory(category)}
          </Typography>
          
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card 
                  onClick={() => router.push(service.path)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                        color: 'primary.main'
                      }}
                    >
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mr: 1.5,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        '& svg': {
                          fontSize: '1.5rem'
                        }
                      }}>
                        {service.icon}
                      </Box>
                      <Typography variant="h6" component="h3">
                        {service.name}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  )
}
