"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/user";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { UserGrid, UserModal } from "@/components/users";
import PaginationNav from "@/components/episodes/PaginationNav";
import LimitSelector from "@/components/episodes/LimitSelector";
import PageIndicator from "@/components/episodes/PageIndicator";
import { toastSuccess } from "@/components/ui/Toast";

export default function UsersPage() {
  const router = useRouter();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const {
    users,
    loading: usersLoading,
    error: usersError,
    meta,
  } = useUsers({ page, limit, search });
  const { deleteUser, loading: deleteLoading } = useDeleteUser();

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserClick = useCallback((user: User) => {
    setSelectedUserId(user.id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  const handleAddClick = useCallback(() => {
    router.push("/dashboard/users/new");
  }, [router]);

  const handleDelete = useCallback(async () => {
    if (!selectedUserId) return;
    const username =
      users.find((u) => u.id === selectedUserId)?.username || "este usuario";
    if (!confirm(`¿Estás seguro de eliminar a ${username}?`)) return;

    const success = await deleteUser(selectedUserId);
    if (success) {
      toastSuccess.userDeleted();
      setSelectedUserId(null);
      setTimeout(() => {
        router.refresh();
      }, 1500);
    }
  }, [selectedUserId, users, deleteUser]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-black uppercase tracking-tight">
            Usuarios
          </h1>
          <p className="font-plus-jakarta text-black/50 mt-1">
            Gestiona todos los usuarios registrados
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="
            px-6 py-3 bg-black text-white font-archivo-black uppercase text-sm
            border-4 border-black rounded-none
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
            hover:translate-x-[-2px] hover:translate-y-[-2px]
            transition-all duration-150
          "
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar por email o usuario..."
          className="w-full px-4 py-3 bg-white border-4 border-black font-plus-jakarta text-black placeholder-black/40 focus:outline-none focus:bg-[#f9c937]/20"
        />
      </div>

      {/* Pagination controls */}
      {meta && (
        <div className="flex items-center justify-between mb-6 p-4 bg-black/[0.03] border-4 border-black">
          <LimitSelector value={limit} onChange={handleLimitChange} />
          <PageIndicator
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
          />
          <PaginationNav pagination={meta} onPageChange={handlePageChange} />
        </div>
      )}

      <UserGrid
        users={users}
        isLoading={usersLoading}
        error={usersError}
        onUserClick={handleUserClick}
        onAddClick={handleAddClick}
      />

      {/* User detail modal */}
      {selectedUserId && (
        <div className="fixed inset-0 z-[1000]">
          <UserModal
            userId={selectedUserId}
            isOpen={true}
            onClose={handleCloseModal}
          />
          {/* Delete button overlay on modal */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1001]">
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-6 py-3 bg-red-600 text-white font-archivo-black uppercase text-sm border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteLoading ? "Eliminando..." : "Eliminar usuario"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
