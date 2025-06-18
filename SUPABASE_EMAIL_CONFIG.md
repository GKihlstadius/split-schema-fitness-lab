# Supabase Email Konfiguration

För att fixa problemet med token-länkar efter email bekräftelse, följ dessa steg i Supabase Dashboard:

## 🔧 Steg 1: Gå till Authentication Settings

1. Logga in på [Supabase Dashboard](https://supabase.com)
2. Välj ditt projekt
3. Gå till **Authentication** → **Settings**

## 📧 Steg 2: Konfigurera Email Templates

### Under "Email Templates" sektionen:

1. Klicka på **"Confirm signup"** template
2. Ändra **"Redirect URL"** till:
   ```
   {{ .SiteURL }}/
   ```
   (Bara en slash för att gå till hem-sidan)

3. Eller för att gå direkt till AuthCallback:
   ```
   {{ .SiteURL }}/auth/callback
   ```

## 🌐 Steg 3: Site URL Configuration

Under **"Site URL"** sektionen:

- **Site URL:** `https://split-schema-fitness-lab.vercel.app`
- **Additional Redirect URLs:**
  ```
  http://localhost:3000/**
  https://split-schema-fitness-lab.vercel.app/**
  ```

## ✅ Steg 4: Disable Email Confirmation (Alternativ)

Om du vill slippa email confirmation helt:

1. Gå till **Authentication** → **Settings**
2. Under **"Email"** sektionen
3. Stäng av **"Enable email confirmations"**

## 🎯 Resultat

Efter denna konfiguration:
- Registrering → Inget redirect med tokens
- Email bekräftelse → Redirect till hem-sidan eller AuthCallback
- Smidig användarupplevelse utan synliga tokens

## 🔍 Debug

Om det fortfarande inte fungerar, kontrollera:
1. Browser cache (Ctrl+Shift+R för hard refresh)
2. Supabase logs i Dashboard
3. Console logs i webbläsaren 