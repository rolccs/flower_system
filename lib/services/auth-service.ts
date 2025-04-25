import { prisma } from "@/lib/prisma"
import { hash, compare } from "bcrypt"
import { sign, verify } from "jsonwebtoken"

// Tipos para autenticación
export interface UserCredentials {
  email: string
  password: string
}

export interface UserSession {
  id: string
  name: string
  email: string
  role: string
  permissions: string[]
}

export interface AuthResult {
  success: boolean
  message: string
  user?: UserSession
  token?: string
}

// Función para registrar un nuevo usuario
export async function registerUser(userData: {
  name: string
  email: string
  password: string
  role?: string
}): Promise<AuthResult> {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    })

    if (existingUser) {
      return {
        success: false,
        message: "El correo electrónico ya está registrado",
      }
    }

    // Hashear la contraseña
    const hashedPassword = await hash(userData.password, 10)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "user",
      },
    })

    // Obtener permisos según el rol
    const permissions = await getPermissionsByRole(user.role)

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
    })

    return {
      success: true,
      message: "Usuario registrado correctamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
      },
      token,
    }
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    return {
      success: false,
      message: "Error al registrar usuario",
    }
  }
}

// Función para iniciar sesión
export async function loginUser(credentials: UserCredentials): Promise<AuthResult> {
  try {
    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    })

    if (!user) {
      return {
        success: false,
        message: "Credenciales inválidas",
      }
    }

    // Verificar la contraseña
    const passwordValid = await compare(credentials.password, user.password)

    if (!passwordValid) {
      return {
        success: false,
        message: "Credenciales inválidas",
      }
    }

    // Obtener permisos según el rol
    const permissions = await getPermissionsByRole(user.role)

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions,
    })

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions,
      },
      token,
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      success: false,
      message: "Error al iniciar sesión",
    }
  }
}

// Función para verificar un token JWT
export function verifyToken(token: string): UserSession | null {
  try {
    // Verificar el token
    const decoded = verify(token, process.env.JWT_SECRET || "secret_key") as UserSession

    return decoded
  } catch (error) {
    console.error("Error al verificar token:", error)
    return null
  }
}

// Función para generar un token JWT
function generateToken(payload: UserSession): string {
  return sign(payload, process.env.JWT_SECRET || "secret_key", {
    expiresIn: "24h",
  })
}

// Función para obtener permisos según el rol
async function getPermissionsByRole(role: string): Promise<string[]> {
  // En un sistema real, esto se obtendría de la base de datos
  switch (role) {
    case "admin":
      return [
        "users:read",
        "users:write",
        "inventory:read",
        "inventory:write",
        "sales:read",
        "sales:write",
        "reports:read",
        "reports:write",
        "settings:read",
        "settings:write",
      ]
    case "manager":
      return [
        "users:read",
        "inventory:read",
        "inventory:write",
        "sales:read",
        "sales:write",
        "reports:read",
        "settings:read",
      ]
    case "sales":
      return ["inventory:read", "sales:read", "sales:write", "reports:read"]
    case "delivery":
      return ["inventory:read", "sales:read"]
    default:
      return ["inventory:read"]
  }
}

// Función para verificar permisos
export function hasPermission(user: UserSession, permission: string): boolean {
  return user.permissions.includes(permission)
}

// Función para cambiar contraseña
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthResult> {
  try {
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
      }
    }

    // Verificar la contraseña actual
    const passwordValid = await compare(currentPassword, user.password)

    if (!passwordValid) {
      return {
        success: false,
        message: "La contraseña actual es incorrecta",
      }
    }

    // Hashear la nueva contraseña
    const hashedPassword = await hash(newPassword, 10)

    // Actualizar la contraseña
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return {
      success: true,
      message: "Contraseña actualizada correctamente",
    }
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    return {
      success: false,
      message: "Error al cambiar contraseña",
    }
  }
}

// Función para cerrar sesión (invalidar token)
export function logoutUser(): AuthResult {
  // En un sistema real, se podría agregar el token a una lista negra
  return {
    success: true,
    message: "Sesión cerrada correctamente",
  }
}
