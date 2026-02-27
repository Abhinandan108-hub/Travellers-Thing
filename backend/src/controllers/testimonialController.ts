import { Request, Response, NextFunction } from 'express';
import Testimonial from '../models/Testimonial';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isFeatured } = req.query;
    const query: Record<string, unknown> = { isApproved: true };
    if (isFeatured) query.isFeatured = isFeatured === 'true';

    const testimonials = await Testimonial.find(query)
      .populate('user', 'name avatar')
      .populate('package', 'title')
      .populate('destination', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (admin)
// @route   GET /api/testimonials/all
// @access  Admin
export const getAllTestimonials = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const testimonials = await Testimonial.find()
      .populate('user', 'name avatar email')
      .populate('package', 'title')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
export const createTestimonial = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const testimonial = await Testimonial.create({ ...req.body, user: req.user?._id });
    res.status(201).json({ success: true, message: 'Testimonial submitted for review', data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/reject testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Admin
export const approveTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { isApproved, isFeatured } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved, isFeatured },
      { new: true }
    );
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Testimonial updated', data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Admin
export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Testimonial not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};