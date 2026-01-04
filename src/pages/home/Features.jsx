import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import { Container } from "@mui/system";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function Features() {
  return (
    <Container>

   
    <Box sx={{ bgcolor: "#f6f8fb", py: 8 }}>
      <Typography sx={{fontSize:"35px",color:"#202124"}} textAlign="center" mb={1}>
        What We Offer?
      </Typography>

      <Typography
        textAlign="center"
        color="text.secondary"
        mb={6}
      >
        The most excellent travel choices available worldwide.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* TOP ROW – 3 cards */}
        {[1, 2, 3,4].map((i) => (
          <Grid item xs={12} md={3} key={i}>
            <OfferCard />
          </Grid>
        ))}

      
      </Grid>
    </Box>
     </Container>
  );
}

function OfferCard() {
  return (
    <Card
      sx={{
        textAlign: "center",
        py: 5,
        borderRadius: 3,
        boxShadow: "0px 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          bgcolor: "#E3F0FF",
          borderRadius: "50%",
          mx: "auto",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlightTakeoffIcon sx={{ color: "#123D6E" }} />
      </Box>

      <CardContent>
        <Typography sx={{fontSize:"16px",color:"#202124",fontWeight:500}}>
         The most excellent travel  choices available worldwide.

        </Typography>
        <Typography sx={{fontSize:"13px",color:"#B1B9C6",fontWeight:500}}>
          vel laoreet laoreet tristique faucibus aliquet. Ut vitae sit pharetra commodo velit nisi et volutpat. Etiam amet ipsum egestas et et vel feugiat id consequat. Diam feugiat 
        </Typography>
      </CardContent>
    </Card>
  );
}
