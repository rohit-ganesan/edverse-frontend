# UI Components Library

This directory contains reusable UI components built on top of Radix UI primitives with Tailwind CSS styling.

## 🎨 Design System

All components follow a consistent design system with:

- **Colors**: Brand colors defined in `tailwind.config.js`
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized padding and margins
- **Accessibility**: WCAG 2.1 AA compliance through Radix UI

## 🧩 Available Components

### Form Components

#### `RadixTextField`

Text input component with validation states and labels.

```typescript
interface RadixTextFieldProps {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password';
  value?: string;
  onChange?: (value: string) => void;
}
```

**Usage**:

```tsx
<RadixTextField
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  required
  error={errors.email}
  value={email}
  onChange={setEmail}
/>
```

#### `RadixButton`

Customizable button component with multiple variants.

```typescript
interface RadixButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:

```tsx
<RadixButton
  variant="primary"
  size="lg"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Sign In
</RadixButton>
```

#### `RadixRadioGroup`

Radio button group with descriptions and validation.

```typescript
interface RadixRadioGroupProps {
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

**Usage**:

```tsx
<RadixRadioGroup
  options={[
    {
      value: 'Student',
      label: 'Student',
      description: 'Access courses and assignments',
    },
    {
      value: 'Instructor',
      label: 'Instructor',
      description: 'Create and manage courses',
    },
  ]}
  value={role}
  onValueChange={setRole}
  error={errors.role}
  required
/>
```

### Layout Components

#### `RadixCard`

Card container with consistent styling.

```typescript
interface RadixCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}
```

**Usage**:

```tsx
<RadixCard padding="lg">
  <h2>Dashboard Stats</h2>
  <p>Content goes here</p>
</RadixCard>
```

#### `RadixSeparator`

Visual separator line.

```typescript
interface RadixSeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
```

### Utility Components

#### `FormField`

Wrapper component for form fields with consistent spacing and error handling.

```typescript
interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Usage**:

```tsx
<FormField label="Password" error={errors.password} required>
  <RadixTextField
    type="password"
    placeholder="Enter password"
    value={password}
    onChange={setPassword}
  />
</FormField>
```

#### `LineItem`

Display component for key-value pairs.

```typescript
interface LineItemProps {
  label: string;
  value: string | number;
  className?: string;
}
```

#### `Toast`

Notification component for user feedback.

```typescript
interface ToastProps {
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
```

## 🎯 Usage Guidelines

### Component Composition

Components are designed to be composed together:

```tsx
function LoginForm() {
  return (
    <RadixCard padding="lg">
      <form onSubmit={handleSubmit}>
        <FormField label="Email" error={errors.email} required>
          <RadixTextField type="email" value={email} onChange={setEmail} />
        </FormField>

        <RadixSeparator />

        <RadixButton variant="primary" loading={isSubmitting} type="submit">
          Sign In
        </RadixButton>
      </form>
    </RadixCard>
  );
}
```

### Styling Conventions

- Use Tailwind utility classes exclusively
- Extend base styles through `className` prop
- Follow consistent spacing patterns
- Maintain accessibility standards

### Error Handling

All form components support error states:

```tsx
<RadixTextField
  error={errors.email}
  // Component automatically shows error styling
/>
```

## 🧪 Testing

Components are tested with Jest and React Testing Library:

```bash
# Run UI component tests
npm test src/components/ui

# Run with coverage
npm test src/components/ui -- --coverage
```

### Test Examples

```typescript
// RadixButton.test.tsx
test('shows loading state', () => {
  render(<RadixButton loading>Submit</RadixButton>);
  expect(screen.getByRole('button')).toBeDisabled();
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// RadixTextField.test.tsx
test('displays error message', () => {
  render(
    <RadixTextField
      error="Email is required"
      label="Email"
    />
  );
  expect(screen.getByText('Email is required')).toBeInTheDocument();
});
```

## 🎨 Theming

Components use CSS custom properties for theming:

```css
/* In index.css */
:root {
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-error: #ef4444;
  --color-success: #10b981;
}
```

### Dark Mode Support

Components automatically adapt to dark mode through Tailwind's dark mode classes:

```tsx
// Components use dark: variants
className = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
```

## 🔧 Customization

### Extending Components

Create custom variants by extending base components:

```tsx
// Custom primary button
function PrimaryButton(props: RadixButtonProps) {
  return (
    <RadixButton
      {...props}
      variant="primary"
      className={`custom-primary ${props.className}`}
    />
  );
}
```

### Adding New Components

Follow this pattern when adding new UI components:

1. **Create component file** in `src/components/ui/`
2. **Use Radix UI primitive** as base
3. **Apply Tailwind styling** consistently
4. **Add TypeScript interfaces** for props
5. **Include accessibility features**
6. **Write comprehensive tests**
7. **Update this documentation**

### Component Template

```tsx
import React from 'react';
import * as RadixPrimitive from '@radix-ui/react-primitive';
import { cn } from '@/lib/utils'; // Utility for className merging

interface MyComponentProps {
  // Define props with proper types
  children: React.ReactNode;
  variant?: 'default' | 'alternate';
  className?: string;
}

export function MyComponent({
  children,
  variant = 'default',
  className,
  ...props
}: MyComponentProps): JSX.Element {
  return (
    <RadixPrimitive.Root
      className={cn(
        // Base styles
        'base-styles',
        // Variant styles
        {
          'variant-default': variant === 'default',
          'variant-alternate': variant === 'alternate',
        },
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </RadixPrimitive.Root>
  );
}
```

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🚀 Development

### Adding Icons

Use a consistent icon library (e.g., Lucide React):

```tsx
import { ChevronDown, User, Settings } from 'lucide-react';

// Use in components
<ChevronDown className="w-4 h-4" />;
```

### Performance Considerations

- Components are tree-shakeable
- Use React.memo for expensive components
- Minimize re-renders with proper prop design
- Lazy load heavy components when possible

For questions or contributions, refer to the project's contribution guidelines.
