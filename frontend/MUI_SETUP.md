# Material UI Integration Guide

## What's Been Set Up

### 1. Packages Installed
- `@mui/material` - Core Material UI components
- `@mui/icons-material` - Material UI icons (optional, using lucide-react)
- `@emotion/react` & `@emotion/styled` - Required for MUI styling
- `@emotion/cache` - For SSR support

### 2. Theme Configuration
- Custom theme in `lib/theme.ts` matching Everest design system
- Colors: Charcoal primary, Saffron secondary, Status colors
- Typography: Inter font family
- Component overrides for consistent styling

### 3. Providers
- `MUIThemeProvider` wrapper in `lib/mui-theme-provider.tsx`
- Integrated into root layout with `CssBaseline`

### 4. Components Updated
- ✅ Home page - Using MUI Box, Container, Typography, Button, Card, Grid
- ✅ Menu page - Using MUI Tabs, Card, Chip, IconButton
- ✅ BottomNav - Using MUI BottomNavigation
- ✅ Toast - Using MUI Snackbar and Alert

## Usage Examples

### Basic Components
```tsx
import { Button, Card, Typography } from '@mui/material'

<Button variant="contained" color="primary">
  Click Me
</Button>

<Card>
  <Typography variant="h1">Title</Typography>
</Card>
```

### Theming
```tsx
import { useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'

const theme = useTheme()
<Box sx={{ color: 'primary.main', bgcolor: 'background.paper' }}>
  Content
</Box>
```

### Status Colors
```tsx
import { statusColors } from '@/lib/theme'

<Box sx={{ bgcolor: statusColors.low }}>Low Status</Box>
```

## Next Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Update Remaining Pages**
   - Cart page - Use MUI List, ListItem, Divider
   - Checkout page - Use MUI TextField, FormControl
   - Admin pages - Use MUI DataGrid, Table, Dialog

3. **Custom Components**
   - Create reusable MUI-based components
   - Use MUI's theming system for consistency

## Benefits

- ✅ Consistent design system
- ✅ Accessibility built-in
- ✅ Responsive by default
- ✅ Extensive component library
- ✅ TypeScript support
- ✅ Easy theming

