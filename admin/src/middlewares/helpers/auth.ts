import axios from 'axios';
import apiConfig from '@/configs/api';

export async function validateToken(token: string) {
  try {
    const response = await axios.get(apiConfig.users.getUserFromToken, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data; // Trả về thông tin user
    }

    return null; // Token không hợp lệ
  } catch (error) {
    console.error('Error validating token:', (error as Error).message);
    return null; // Xử lý lỗi
  }
}
