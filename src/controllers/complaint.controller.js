const ComplaintService = require('../services/complaint.service');

exports.createComplaint = async (req, res) => {
  try {
    const { village_id, citizen_id, category, title, description, issue_photo_url } = req.body;

    if (!village_id || !citizen_id || !category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'village_id, citizen_id, category, title, and description are required',
      });
    }

    const complaint = await ComplaintService.lodgeComplaint({
      village_id,
      citizen_id,
      category,
      title,
      description,
      issue_photo_url,
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await ComplaintService.getAllComplaints();
    return res.status(200).json({ success: true, data: complaints });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, officer_remarks, resolution_photo_url } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const result = await ComplaintService.updateStatus(id, {
      status,
      officer_remarks,
      resolution_photo_url,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};