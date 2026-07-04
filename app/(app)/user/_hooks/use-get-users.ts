import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions";
import { IUserResponse } from "@/types/user.type";

export const GET_USERS_QUERY_KEY = "users";

const useGetUsers = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [GET_USERS_QUERY_KEY],
    queryFn: async () => {
      const result = await getUsers();
      return result.status === 200 ? result.data : null;
    },
  });

  const usersData: IUserResponse[] = data ?? [];

  return { usersData, isLoading, isFetching, refetch };
};

export default useGetUsers;
