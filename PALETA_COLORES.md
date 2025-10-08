# 🎨 Guía de Uso de Colores de Marca

## Paleta de Colores Configurada

### 🌑 **brand-dark** - Fondos Oscuros

- **Color base**: `#0a1128`
- **Uso**: Fondos principales, headers, secciones destacadas

```jsx
className = "bg-brand-dark text-brand-light";
className = "bg-brand-dark-600"; // Más oscuro
className = "bg-brand-dark-300"; // Más claro
```

### 💎 **brand-contrast** - Color de Contraste

- **Color base**: `#1282a2`
- **Uso**: Enlaces, elementos interactivos, destacados

```jsx
className = "text-brand-contrast";
className = "border-brand-contrast";
className = "hover:bg-brand-contrast";
```

### ☀️ **brand-light** - Fondos Claros

- **Color base**: `#fefcfb`
- **Uso**: Fondos de contenido, cards, áreas claras

```jsx
className = "bg-brand-light text-brand-dark";
className = "text-brand-light"; // Texto claro sobre fondo oscuro
```

### 🔵 **brand-button** - Botones Principales

- **Color base**: `#001f54`
- **Uso**: Botones de acción principal, CTAs

```jsx
className = "bg-brand-button text-brand-light hover:bg-brand-button-600";
className = "border-2 border-brand-button text-brand-button";
```

### 🔷 **brand-alt** - Azul Alternativo

- **Color base**: `#034078`
- **Uso**: Botones secundarios, badges, alternativas

```jsx
className = "bg-brand-alt text-brand-light hover:bg-brand-alt-600";
className = "text-brand-alt font-semibold";
```

## 📋 Ejemplos Prácticos

### Ejemplo 1: Navbar

```jsx
<nav className="bg-brand-dark shadow-lg">
  <div className="text-brand-light hover:text-brand-contrast">Enlace</div>
</nav>
```

### Ejemplo 2: Botón Principal

```jsx
<button className="bg-brand-button text-brand-light px-6 py-3 rounded-lg hover:bg-brand-button-600 transition-colors">
  Comprar Ahora
</button>
```

### Ejemplo 3: Card

```jsx
<div className="bg-brand-light rounded-xl shadow-lg p-6 border-2 border-brand-contrast/20">
  <h3 className="text-brand-dark font-bold">Título</h3>
  <p className="text-brand-dark-400">Descripción</p>
</div>
```

### Ejemplo 4: Badge/Tag

```jsx
<span className="bg-brand-alt text-brand-light px-3 py-1 rounded-full text-sm">
  Nuevo
</span>
```

### Ejemplo 5: Gradientes

```jsx
className = "bg-gradient-to-r from-brand-button to-brand-alt";
className = "bg-gradient-to-b from-brand-dark to-brand-dark-700";
```

## 🎯 Combinaciones Recomendadas

### Esquema Oscuro

- **Fondo**: `bg-brand-dark`
- **Texto**: `text-brand-light`
- **Acentos**: `text-brand-contrast`
- **Botones**: `bg-brand-button`

### Esquema Claro

- **Fondo**: `bg-brand-light`
- **Texto**: `text-brand-dark`
- **Acentos**: `text-brand-contrast`
- **Botones**: `bg-brand-alt`

### Esquema de Contraste Alto

- **Fondo**: `bg-brand-dark`
- **Elementos destacados**: `bg-brand-contrast`
- **Texto**: `text-brand-light`
- **Botones**: `bg-brand-button`

## 💡 Tips de Uso

1. **Opacidad**: Puedes usar `/opacity` con cualquier color

   ```jsx
   className = "bg-brand-contrast/20"; // 20% opacidad
   className = "border-brand-button/50"; // 50% opacidad
   ```

2. **Estados hover/focus**: Usa tonos más oscuros (600-700)

   ```jsx
   className = "bg-brand-button hover:bg-brand-button-600";
   ```

3. **Sombras con color**: Añade color a las sombras

   ```jsx
   className = "shadow-lg shadow-brand-contrast/30";
   ```

4. **Degradados**: Combina colores de tu marca
   ```jsx
   className =
     "bg-gradient-to-r from-brand-button via-brand-alt to-brand-contrast";
   ```
