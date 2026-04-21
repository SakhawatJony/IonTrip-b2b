import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import logoImg from '../../assets/logo1.png';
import paymentMethodsImg from '../../assets/payment.png';
import { SECTION_CONTAINER_SX, SECTION_MAX_WIDTH } from '../../constants/sectionLayout';

const colors = {
  gray: '#cbd5e1',
  blueHover: '#023a94',
};

const nav = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/' },
  { label: 'Contact', to: '/' },
  { label: 'Help', to: '/' },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        borderTop: `1px solid ${alpha('#ffffff', 0.18)}`,
        bgcolor: theme.palette.primary.main,
        mt: 'auto',
      })}
    >
      <Container
        maxWidth={SECTION_MAX_WIDTH}
        disableGutters
        sx={{ ...SECTION_CONTAINER_SX, py: { xs: 5, md: 6 } }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 4 }}
        >
          <Box sx={{ flex: { md: '1 1 200px' }, minWidth: 0 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{ mb: 1.5, display: 'inline-flex', textDecoration: 'none' }}
            >
              <Box
                component="img"
                src={logoImg}
                alt="Iontrip"
                sx={{ height: 32, width: 'auto', maxWidth: 160, objectFit: 'contain' }}
              />
            </Box>
            <Typography sx={{ fontSize: 13, color: colors.gray, lineHeight: 1.7, mb: 2 }}>
              Iontrip helps you book flights, hotels, tours, and visas with a smooth search
              experience and trusted B2B Agent partners.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[LinkedInIcon, FacebookIcon, TwitterIcon, YouTubeIcon].map((Icon, i) => (
                <IconButton
                  key={i}
                  size="small"
                  component="a"
                  href="#"
                  aria-label="Social link"
                  sx={{
                    color: colors.gray,
                    bgcolor: '#ffffff',
                    border: '#ffffff',
                    '&:hover': { color: '#ffffff', bgcolor: colors.blueHover },
                  }}
                >
                  <Icon sx={{ fontSize: 18, color: 'var(--primary-color)' }} />
                </IconButton>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: { md: '0 1 120px' } }}>
            <Typography
              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 14, mb: 2, color: '#e2e8f0' }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {nav.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  underline="hover"
                  color="inherit"
                  sx={{ fontSize: 13, color: colors.gray }}
                >
                  {item.label}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: { md: '0 1 160px' } }}>
            <Typography
              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 14, mb: 2, color: '#e2e8f0' }}
            >
              Services
            </Typography>
            <Stack spacing={1}>
              <Link
                component={RouterLink}
                to="/#home-search"
                underline="hover"
                sx={{ fontSize: 13, color: colors.gray, fontWeight: 600 }}
              >
                Book travel
              </Link>
              {[
                { label: 'Flights', to: '/#home-search' },
                { label: 'Hotels', to: '/#home-search' },
                { label: 'Tour packages', to: '/#home-search' },
                { label: 'Visa', to: '/#home-search' },
                { label: 'B2B Agent', to: 'https://b2b.iontrip.com/' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  component={RouterLink}
                  to={to}
                  underline="hover"
                  sx={{ fontSize: 13, color: colors.gray }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box sx={{ flex: { md: '0 1 200px' } }}>
            <Typography
              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 14, mb: 2, color: '#e2e8f0' }}
            >
              Contact
            </Typography>
            <Typography component="div" sx={{ fontSize: 13, color: colors.gray, lineHeight: 1.7 }}>
              9-06, Wisma Zelan, Jalan Tasik
              <br />
              Permaisuri 2, Bandar Tun Razak,
              <br />
              56000 Kuala Lumpur,
              <br />
              Malaysia
              <br />
              <Link href="mailto:support@iontrip.com" sx={{ color: 'inherit', textDecoration: 'underline' }}>
                support@iontrip.com
              </Link>
              <br />
              <Link
                href="https://www.iontrip.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecoration: 'underline' }}
              >
                www.iontrip.com
              </Link>
              <br />
              <Link
                href="https://www.iontrip.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecoration: 'underline' }}
              >
                +880 176392632
              </Link>
            </Typography>
          </Box>

          <Box sx={{ flex: { md: '1 1 260px' }, minWidth: { xs: '100%', md: 220 }, maxWidth: { md: 320 } }}>
            <Typography
              sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 14, mb: 2, color: '#e2e8f0' }}
            >
              We accept
            </Typography>
            <Box
              component="img"
              src={paymentMethodsImg}
              alt="Accepted payment methods"
              loading="lazy"
              sx={{
                display: 'block',
                width: '100%',
                maxWidth: { xs: '100%', sm: 380 },
                height: 'auto',
                objectFit: 'contain',
                borderRadius: 1,

                p: { xs: 1, sm: 1.25 },
                boxSizing: 'border-box',
              }}
            />
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ pt: 3, borderTop: '0.5px solid grey' }}
        >
          <Typography sx={{ fontSize: 12, color: colors.gray }}>
            © {new Date().getFullYear()} © iontrip.com. All rights reserved. Ion Trip & Travel Sdn. Bhd.Powered by{' '}
            <Link
              href="https://ionozia.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'inherit', textDecoration: 'underline' }}
            >
              ionozia
            </Link>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
            <Link href="#" sx={{ fontSize: 12, color: colors.gray, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Typography sx={{ fontSize: 12, color: colors.gray }}>|</Typography>
            <Link href="#" sx={{ fontSize: 12, color: colors.gray, textDecoration: 'none' }}>
              Terms of Service
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
