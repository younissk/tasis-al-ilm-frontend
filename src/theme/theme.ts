import { createTheme } from '@mantine/core'

// Custom color palette for the educational platform
const primaryColor = [
  '#f0f9ff', // 0 - lightest
  '#e0f2fe', // 1
  '#bae6fd', // 2
  '#7dd3fc', // 3
  '#38bdf8', // 4
  '#0ea5e9', // 5 - main
  '#0284c7', // 6
  '#0369a1', // 7
  '#075985', // 8
  '#0c4a6e', // 9 - darkest
]

const secondaryColor = [
  '#fefce8', // 0 - lightest
  '#fef9c3', // 1
  '#fef08a', // 2
  '#fde047', // 3
  '#facc15', // 4
  '#eab308', // 5 - main
  '#ca8a04', // 6
  '#a16207', // 7
  '#854d0e', // 8
  '#713f12', // 9 - darkest
]

const successColor = [
  '#f0fdf4', // 0 - lightest
  '#dcfce7', // 1
  '#bbf7d0', // 2
  '#86efac', // 3
  '#4ade80', // 4
  '#22c55e', // 5 - main
  '#16a34a', // 6
  '#15803d', // 7
  '#166534', // 8
  '#14532d', // 9 - darkest
]

const warningColor = [
  '#fffbeb', // 0 - lightest
  '#fef3c7', // 1
  '#fde68a', // 2
  '#fcd34d', // 3
  '#fbbf24', // 4
  '#f59e0b', // 5 - main
  '#d97706', // 6
  '#b45309', // 7
  '#92400e', // 8
  '#78350f', // 9 - darkest
]

const errorColor = [
  '#fef2f2', // 0 - lightest
  '#fee2e2', // 1
  '#fecaca', // 2
  '#fca5a5', // 3
  '#f87171', // 4
  '#ef4444', // 5 - main
  '#dc2626', // 6
  '#b91c1c', // 7
  '#991b1b', // 8
  '#7f1d1d', // 9 - darkest
]

const neutralColor = [
  '#fafafa', // 0 - lightest
  '#f4f4f5', // 1
  '#e4e4e7', // 2
  '#d4d4d8', // 3
  '#a1a1aa', // 4
  '#71717a', // 5 - main
  '#52525b', // 6
  '#3f3f46', // 7
  '#27272a', // 8
  '#18181b', // 9 - darkest
]

export const theme = createTheme({
  // Color palette
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    success: successColor,
    warning: warningColor,
    error: errorColor,
    neutral: neutralColor,
  },

  // Primary color
  primaryColor: 'primary',
  primaryShade: { light: 5, dark: 6 },

  // Default radius for components
  defaultRadius: 'md',

  // Font family
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  // Headings
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '700' },
      h2: { fontSize: '2rem', lineHeight: '1.3', fontWeight: '600' },
      h3: { fontSize: '1.5rem', lineHeight: '1.4', fontWeight: '600' },
      h4: { fontSize: '1.25rem', lineHeight: '1.4', fontWeight: '600' },
      h5: { fontSize: '1.125rem', lineHeight: '1.4', fontWeight: '600' },
      h6: { fontSize: '1rem', lineHeight: '1.4', fontWeight: '600' },
    },
  },

  // Spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  // Breakpoints
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },

  // Shadows
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Component overrides
  components: {
    // AppShell
    AppShell: {
      defaultProps: {
        padding: 'lg',
      },
      styles: {
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          minHeight: '100vh',
        },
        header: {
          backgroundColor: 'white',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
        navbar: {
          backgroundColor: 'white',
          borderRight: '1px solid var(--mantine-color-gray-2)',
        },
      },
    },

    // Button
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md,
          },
        },
      }),
    },

    // Card
    Card: {
      defaultProps: {
        radius: 'lg',
        shadow: 'sm',
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 'var(--mantine-shadow-lg)',
          },
        },
      },
    },

    // NavLink
    NavLink: {
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
          marginBottom: theme.spacing.xs,
          transition: 'all 0.2s ease',
        },
      }),
    },

    // Badge
    Badge: {
      defaultProps: {
        radius: 'xl',
        size: 'md',
      },
      styles: {
        root: {
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },

    // Alert
    Alert: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          border: 'none',
          boxShadow: 'var(--mantine-shadow-sm)',
        },
      },
    },

    // Table
    Table: {
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
        },
        thead: {
          '& tr th': {
            backgroundColor: theme.colors.gray[0],
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
        tbody: {
          '& tr': {
            transition: 'background-color 0.2s ease',
          },
        },
      }),
    },

    // Skeleton
    Skeleton: {
      styles: (theme) => ({
        root: {
          borderRadius: theme.radius.md,
        },
      }),
    },

    // Avatar
    Avatar: {
      defaultProps: {
        radius: 'xl',
      },
    },

    // Image
    Image: {
      styles: {
        root: {
          borderRadius: 'var(--mantine-radius-md)',
          overflow: 'hidden',
        },
      },
    },
  },

  // Other theme properties
  other: {
    // Custom properties for the educational platform
    gradient: {
      primary: 'linear-gradient(135deg, var(--mantine-color-primary-5) 0%, var(--mantine-color-primary-7) 100%)',
      secondary: 'linear-gradient(135deg, var(--mantine-color-secondary-5) 0%, var(--mantine-color-secondary-7) 100%)',
      success: 'linear-gradient(135deg, var(--mantine-color-success-5) 0%, var(--mantine-color-success-7) 100%)',
      warning: 'linear-gradient(135deg, var(--mantine-color-warning-5) 0%, var(--mantine-color-warning-7) 100%)',
      error: 'linear-gradient(135deg, var(--mantine-color-error-5) 0%, var(--mantine-color-error-7) 100%)',
    },
    
    // Animation durations
    transition: {
      fast: '0.15s',
      normal: '0.2s',
      slow: '0.3s',
    },
  },
})

// Dark theme variant
export const darkTheme = createTheme({
  ...theme,
  colors: {
    ...theme.colors,
    // Override colors for dark mode
    dark: [
      '#C1C2C5', // 0 - lightest
      '#A6A7AB', // 1
      '#909296', // 2
      '#5c5f66', // 3
      '#373A40', // 4
      '#2C2E33', // 5 - main
      '#25262b', // 6
      '#1A1B1E', // 7
      '#141517', // 8
      '#101113', // 9 - darkest
    ],
  },
  primaryShade: { light: 4, dark: 6 },
  components: {
    ...theme.components,
    AppShell: {
      ...theme.components?.AppShell,
      styles: {
        main: {
          backgroundColor: 'var(--mantine-color-dark-8)',
          minHeight: '100vh',
        },
        header: {
          backgroundColor: 'var(--mantine-color-dark-7)',
          borderBottom: '1px solid var(--mantine-color-dark-6)',
        },
        navbar: {
          backgroundColor: 'var(--mantine-color-dark-7)',
          borderRight: '1px solid var(--mantine-color-dark-6)',
        },
      },
    },
  },
})
