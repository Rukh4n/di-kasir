import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm, router } from '@inertiajs/react';
import Create from './Create';
import Edit from './Edit';
import UserFlashMessage from './UserFlashMessage';
import UserHeaderFilter from './UserHeaderFilter';
import UserCardGrid from './UserCardGrid';
import UserPagination from './UserPagination';
import UserDeleteModal from './UserDeleteModal';

const Index = ({ users = { data: [], links: [] }, roles = [], branches = [], filters = {}, flash = {} }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [search, setSearch] = useState(filters.search || '');
  const [role, setRole] = useState(filters.role || '');
  const [branchId, setBranchId] = useState(filters.branch_id || '');

  // Form setup for Delete
  const { delete: destroy, processing: deleteProcessing } = useForm();

  const handleSearch = () => {
    router.get(
      route('users.index'),
      { search: search, role: role, branch_id: branchId },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingUser(null);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      destroy(route('users.destroy', deletingUser.id), {
        onSuccess: () => closeDeleteModal(),
      });
    }
  };

  const userList = users?.data || [];

  return (
    <AuthenticatedLayout>
      <Head title="Manajemen User" />

      {/* Main Outer Container: bg-gray-950 */}
      <div className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-6 font-sans pb-24">
        
        {/* Flash Notification */}
        <UserFlashMessage flash={flash} />

        {/* Header & Filter Card Section */}
        <UserHeaderFilter
          openCreateModal={openCreateModal}
          isFilterMobileOpen={isFilterMobileOpen}
          setIsFilterMobileOpen={setIsFilterMobileOpen}
          role={role}
          setRole={setRole}
          roles={roles}
          branchId={branchId}
          setBranchId={setBranchId}
          branches={branches}
          search={search}
          setSearch={setSearch}
          handleKeyDown={handleKeyDown}
          handleSearch={handleSearch}
        />

        {/* Main Content Area - Grid View Only */}
        <UserCardGrid
          userList={userList}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
        />

        {/* Fixed Bottom Pagination Controls */}
        <UserPagination users={users} />

        {/* Create User Modal */}
        <Create
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          roles={roles}
          branches={branches}
        />

        {/* Edit User Modal */}
        <Edit
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          user={editingUser}
          roles={roles}
          branches={branches}
        />

        {/* Delete Confirmation Modal */}
        <UserDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          deletingUser={deletingUser}
          confirmDelete={confirmDelete}
          deleteProcessing={deleteProcessing}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
