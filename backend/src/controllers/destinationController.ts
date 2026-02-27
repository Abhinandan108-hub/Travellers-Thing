import { Request, Response, NextFunction } from 'express';
import Destination from '../models/Destination';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, isPopular, search, page = 1, limit = 10 } = req.query;

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (isPopular) query.isPopular = isPopular === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: destinations.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: destinations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }
    res.status(200).json({ success: true, data: destination });
  } catch (error) {
    next(error);
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Admin
export const createDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, message: 'Destination created', data: destination });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Admin
export const updateDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Destination updated', data: destination });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Admin
export const deleteDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      res.status(404).json({ success: false, message: 'Destination not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Destination deleted' });
  } catch (error) {
    next(error);
  }
};