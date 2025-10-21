import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getAllUsersNoPagination, deleteUser, updateUserRole } from "../api/user";
import Notification from "../components/Notification";

export default function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [checkingAuth, setCheckingAuth] = useState(true); // Nuevo estado para verificación de autenticación

  // Verificar si el usuario actual es ADMIN
  useEffect(() => {
    const userData = localStorage.getItem("user");
    console.log("localStorage.getItem('user'):", userData);
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed);
    }
    setCheckingAuth(false);
  }, []);

  // Cargar usuarios
  useEffect(() => {
    if (currentUser && currentUser.roles?.includes("ADMIN")) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsersNoPagination();
      
      // Si viene paginado, extraer el array de content
      const userList = Array.isArray(data) ? data : (data.content || []);
      
      setUsers(userList);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
      showNotification(error.message || "Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`¿Estás seguro que deseas eliminar al usuario "${username}"?`)) return;

    try {
      await deleteUser(userId);
      showNotification(`Usuario "${username}" eliminado correctamente`, "success");
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error("❌ Error al eliminar usuario:", error);
      showNotification(error.message || "Error al eliminar usuario", "error");
    }
  };

  const handleRoleChange = async (userId, newRole, username) => {
    try {
      const result = await updateUserRole(userId, newRole);
      showNotification(`Rol de "${username}" actualizado a ${newRole}`, "success");
      loadUsers(); // Recargar lista
    } catch (error) {
      console.error("❌ Error al cambiar el rol:", error);
      showNotification(error.message || "Error al cambiar el rol", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ show: false, message: "", type: "success" });
  };

  // Mostrar loading mientras verificamos autenticación
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-contrast"></div>
      </div>
    );
  }

  // Redirigir si no hay usuario autenticado
  if (!currentUser) {
    console.log("No hay usuario, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Redirigir si no es ADMIN
  if (!currentUser.roles?.includes("ADMIN")) {
    console.log("Usuario no es ADMIN, redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-dark">Administración de Usuarios</h1>
          <p className="mt-2 text-gray-600">Gestiona usuarios y sus roles</p>
        </div>

        {/* Tabla de usuarios */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-contrast"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                        {user.id === currentUser.id && (
                          <span className="ml-2 text-xs text-brand-contrast">(Tú)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.roles?.[0] || "BUYER"}
                          onChange={(e) => handleRoleChange(user.id, e.target.value, `${user.firstname} ${user.lastname}`)}
                          disabled={user.id === currentUser.id}
                          className={`text-sm px-3 py-1 rounded-full font-semibold ${
                            user.roles?.includes("ADMIN")
                              ? "bg-purple-100 text-purple-800"
                              : user.roles?.includes("SELLER")
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          } ${user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="SELLER">SELLER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteUser(user.id, `${user.firstname} ${user.lastname}`)}
                          disabled={user.id === currentUser.id}
                          className={`text-red-600 hover:text-red-900 font-medium ${
                            user.id === currentUser.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Total Usuarios</div>
            <div className="mt-2 text-3xl font-bold text-brand-dark">{users.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Compradores</div>
            <div className="mt-2 text-3xl font-bold text-green-600">
              {users.filter((u) => u.roles?.includes("BUYER")).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500">Vendedores</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">
              {users.filter((u) => u.roles?.includes("SELLER")).length}
            </div>
          </div>
        </div>
      </div>

      {/* Notificación */}
      {notification.show && (
        <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      )}
    </div>
  );
}
