const ComplaintModel = require('../models/complaint.model');

class ComplaintService {
  static async lodgeComplaint(data) {
    // Generate a unique token for complaint tracking
    const complaint_token = 'CMP-' + Math.floor(100000 + Math.random() * 900000);

    const newComplaint = await ComplaintModel.create({
      ...data,
      complaint_token,
    });

    return { ...newComplaint, ...data };
  }

  static async getAllComplaints() {
    return await ComplaintModel.findAll();
  }

  static async getComplaintById(id) {
    const complaint = await ComplaintModel.findById(id);
    if (!complaint) {
      const error = new Error('Complaint not found');
      error.statusCode = 404;
      throw error;
    }
    return complaint;
  }

  static async updateStatus(id, updateData) {
    const updated = await ComplaintModel.updateStatus(id, updateData);
    if (!updated) {
      const error = new Error('Complaint not found or update failed');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Complaint status updated successfully' };
  }
}

module.exports = ComplaintService;