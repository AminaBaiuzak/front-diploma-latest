import axios from "axios";
import {
  RegistrationData,
  LoginData,
  IProfile,
  IUpdateProfile,
  IUpdatePassword,
  IUpdateEmail,
} from "@/types/auth";

const registerUser = async (userData: RegistrationData) => {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_URL + "/api/auth/register",
    userData
  );
  if (response.status !== 201) {
    throw new Error("Registration failed");
  }
  return response.data;
};

async function loginUser(userData: LoginData) {
  const response = await axios.post(
    process.env.NEXT_PUBLIC_URL + "/api/auth/login",
    userData
  );
  if (response.status !== 200 || !response.data.token) {
    throw new Error();
  }
  return response.data;
}

const getProfile = async (token: string) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_URL + "/api/distributor/profile",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

const updateProfile = async (items: {
  profileData: IUpdateProfile;
  token: string;
}) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + "/api/distributor/profile",
    items.profileData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const getStoreProfile = async (token: string) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_URL + "/api/store/profile",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

const updateStoreProfile = async (items: {
  profileData: IUpdateProfile;
  token: string;
}) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + "/api/store/profile",
    items.profileData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const updatePassword = async (items: {
  passwordData: IUpdatePassword;
  token: string;
}) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + "/api/user/password",
    items.passwordData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const updateEmail = async (items: {
  emailData: IUpdateEmail;
  token: string;
}) => {
  const response = await axios.put(
    process.env.NEXT_PUBLIC_URL + "/api/user/email",
    items.emailData,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const deleteUser = async (items: { token: string }) => {
  const response = await axios.delete(
    process.env.NEXT_PUBLIC_URL + "/api/user/",
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const getUsers = async (token: string) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_URL + "/api/admin/panel",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

const deleteUserByAdmin = async (items: { token: string, id: string }) => {
  const response = await axios.delete(
    process.env.NEXT_PUBLIC_URL + `/api/admin/delete/user/${items.id}`,
    {
      headers: {
        Authorization: "Bearer " + items.token,
      },
    }
  );
  return response.data;
};

const activateUserByAdmin = async (items: { token: string, id: string }) => {
  const response = await axios.delete(
      process.env.NEXT_PUBLIC_URL + `/api/admin/activate/user/${items.id}`,
      {
        headers: {
          Authorization: "Bearer " + items.token,
        },
      }
  );
  return response.data;
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getStoreProfile,
  updateStoreProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  getUsers,
  deleteUserByAdmin,
  activateUserByAdmin,
};
