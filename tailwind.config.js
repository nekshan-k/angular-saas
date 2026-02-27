module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,js,jsx,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif']
      },
      colors: {
        borderclr: '#cbd0dd',
        black: '#000000',
        white: '#ffffff',
        base: '#f5f7fa',
        neutral: {
          1: '#1f1f1f',
          2: '#4b4b4b',
          3: '#8e8e8e',
          4: '#cacaca',
          5: '#e1e1e1',
          6: '#eeeeee',
          7: '#f5f5f5',
          8: '#fafafa'
        },
        primary: {
          1: '#2d5ecf',
          2: '#3874ff',
          3: '#6090ff',
          4: '#88acff',
          5: '#afc7ff',
          6: '#c3d5ff',
          7: '#d7e3ff',
          8: '#ebf1ff',
          hover: '#E1EAFF'
        },
        secondary: {
          1: '#f56630',
          hover: '#ffece5'
        },
        gray: {
          1: '#525b75',
          2: '#eff2f6'
        },
        placeholder: '#8a94ad',
        'default-stroke': '#cbd0dd',
        disabled: '#eceef1',
        purple: {
          2: '#85a9ff',
          3: '#e5edff'
        },
        label: {
          1: '#141824',
          2: '#31374a'
        },
        body: {
          1: '#222834',
          2: '#3e465b'
        },
        warning: {
          1: '#bc3803',
          2: '#ffcc85',
          3: '#fffbeb',
          4: '#ffd608',
          '4-danger': '#ffb5b7'
        },
        danger: {
          1: '#900b09',
          3: '#ec221f'
        },
        error: '#d42620',
        success: {
          1: '#044b1c',
          2: '#036b26',
          3: '#1c6c09',
          4: '#237d41',
          5: '#25b003',
          6: '#08b839',
          7: '#90d67f',
          8: '#d9fbd0'
        },
        icon: {
          1: '#0a917a',
          2: '#357df5',
          3: '#ff5b98',
          4: '#b861f8',
          5: '#00a6a8',
          6: '#ff8330',
          7: '#ff565c'
        },
        login: {
          from: '#0575e6',
          via: '#02298a',
          to: '#021b79'
        }
      },
      fontSize: {
        lg: '18px',
        base: '16px',
        '21xl': '40px',
        sm: '14px',
        '9xl': '28px',
        xs: '12px',
        xl: '20px'
      },
      borderWidth: {
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px'
      }
    }
  },
  corePlugins: {
    ringWidth: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false
  },
  plugins: []
};
