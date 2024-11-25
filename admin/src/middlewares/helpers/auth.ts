import axios from 'axios';
import apiConfig from '@/configs/api';
import { NextRequest } from 'next/server';

export async function validateToken(token: string) {
  try {
    const response = await axios.get(apiConfig.users.getUserFromToken, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      if (response.data.role === 2) {
        return response.data; // Trả về thông tin user
      }
      return null; // Role không hợp lệ
    }

    return null; // Token không hợp lệ
  } catch (error) {
    console.error('Error validating token:', (error as Error).message);
    return null; // Xử lý lỗi
  }
}

// ... existing code ...
export async function isA (req: NextRequest) {

  const token = req.cookies.get('access_token_admin')?.value;
  
  if (!token) {
    // console.log("Không có token");
    return null; // Return early if there's no token
  }

  try {
    const response = await axios.get(apiConfig.users.getUserFromToken, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if role_id is 2 and return true
    if (response.data.role_id === 2) {
      return true; // Return true if role_id is 2
    }

    return null; // Role không hợp lệ
  } catch (error) {
    console.error('Error validating token:', (error as Error).message);
    return null; // Xử lý lỗi
  }
}
// ... existing code ...