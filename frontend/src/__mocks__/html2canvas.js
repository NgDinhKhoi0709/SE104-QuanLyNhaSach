export default jest.fn().mockImplementation(() => 
  Promise.resolve({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,mock-canvas-data')
  })
);
