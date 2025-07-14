const promotionService = require('../../services/promotionService');
const promotionModel = require('../../models/promotionModel');
const db = require('../../db');

// Mock dependencies
jest.mock('../../models/promotionModel');
jest.mock('../../db');

describe('PromotionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPromotions', () => {
    it('should get all promotions', async () => {
      const mockPromotions = [
        { id: 1, name: 'Test Promotion', type: 'percent', discount: 10 }
      ];
      promotionModel.getAllPromotions.mockResolvedValue(mockPromotions);

      const result = await promotionService.getAllPromotions();

      expect(promotionModel.getAllPromotions).toHaveBeenCalled();
      expect(result).toEqual(mockPromotions);
    });
  });

  describe('addPromotion', () => {
    it('should add promotion successfully', async () => {
      const promotionData = {
        name: 'Test Promotion',
        type: 'percent',
        discount: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minPrice: 100000,
        quantity: 100
      };
      const mockResult = { id: 1 };
      promotionModel.addPromotion.mockResolvedValue(mockResult);

      const result = await promotionService.addPromotion(promotionData);

      expect(promotionModel.addPromotion).toHaveBeenCalledWith(promotionData);
      expect(result).toEqual(mockResult);
    });

    it('should throw error when missing required fields', async () => {
      const incompleteData = {
        name: 'Test Promotion',
        type: 'percent'
        // Missing required fields
      };

      await expect(promotionService.addPromotion(incompleteData)).rejects.toMatchObject({
        status: 400,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    });

    it('should throw error when name is missing', async () => {
      const promotionData = {
        type: 'percent',
        discount: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minPrice: 100000
      };

      await expect(promotionService.addPromotion(promotionData)).rejects.toMatchObject({
        status: 400,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    });
  });

  describe('updatePromotion', () => {
    it('should update promotion successfully', async () => {
      const promotionData = {
        name: 'Updated Promotion',
        type: 'fixed',
        discount: 50000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minPrice: 200000,
        quantity: 50,
        usedQuantity: 10
      };
      promotionModel.updatePromotion.mockResolvedValue({ affectedRows: 1 });

      const result = await promotionService.updatePromotion(1, promotionData);

      expect(promotionModel.updatePromotion).toHaveBeenCalledWith({
        id: 1,
        ...promotionData
      });
      expect(result).toEqual({ message: 'Cập nhật khuyến mãi thành công' });
    });

    it('should set usedQuantity to 0 when not provided', async () => {
      const promotionData = {
        name: 'Updated Promotion',
        type: 'fixed',
        discount: 50000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minPrice: 200000,
        quantity: 50
      };
      promotionModel.updatePromotion.mockResolvedValue({ affectedRows: 1 });

      await promotionService.updatePromotion(1, promotionData);

      expect(promotionModel.updatePromotion).toHaveBeenCalledWith({
        id: 1,
        ...promotionData,
        usedQuantity: 0
      });
    });

    it('should throw error when promotion not found', async () => {
      const promotionData = {
        name: 'Updated Promotion',
        type: 'fixed',
        discount: 50000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        minPrice: 200000
      };
      promotionModel.updatePromotion.mockResolvedValue({ affectedRows: 0 });

      await expect(promotionService.updatePromotion(999, promotionData)).rejects.toMatchObject({
        status: 404,
        message: 'Không tìm thấy khuyến mãi để cập nhật'
      });
    });

    it('should throw error when missing required fields', async () => {
      const incompleteData = {
        name: 'Updated Promotion'
        // Missing required fields
      };

      await expect(promotionService.updatePromotion(1, incompleteData)).rejects.toMatchObject({
        status: 400,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    });
  });

  describe('deletePromotion', () => {
    it('should delete promotion successfully', async () => {
      promotionModel.deletePromotion.mockResolvedValue({ affectedRows: 1 });

      const result = await promotionService.deletePromotion(1);

      expect(promotionModel.deletePromotion).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Xóa khuyến mãi thành công' });
    });

    it('should throw error when promotion not found', async () => {
      promotionModel.deletePromotion.mockResolvedValue({ affectedRows: 0 });

      await expect(promotionService.deletePromotion(999)).rejects.toMatchObject({
        status: 404,
        message: 'Không tìm thấy khuyến mãi để xóa'
      });
    });
  });
});
