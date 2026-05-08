import { useState, useEffect } from "react";
import {
  getAllChallengesAdmin,
  deleteChallenge,
  updateChallenge,
} from "../services/adminChallenges.service";

export const useAllChallenges = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchChallenges = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const data = await getAllChallengesAdmin(currentPage);
      setChallenges(data.data);
      setTotalPages(data.meta.totalPages);
      setError(null);
    } catch (err) {
      setError("Error al cargar los retos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteChallenge(id);
      await fetchChallenges(page);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await updateChallenge(id, data);
      await fetchChallenges(page);
    } catch (err) {
      console.error("Error al actualizar el reto:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchChallenges(page);
  }, [page]);

  return {
    challenges,
    loading,
    error,
    page,
    totalPages,
    setPage,
    handleDelete,
    handleUpdate,
    refetch: () => fetchChallenges(page),
  };
};
