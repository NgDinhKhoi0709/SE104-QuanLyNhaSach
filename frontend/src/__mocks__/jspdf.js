export default {
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    addImage: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    internal: {
      pageSize: {
        width: 210,
        height: 297
      }
    }
  }))
};
