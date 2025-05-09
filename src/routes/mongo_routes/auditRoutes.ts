import { container } from "@config/diContainer";
import express from 'express';
import { AuditController } from '@controller/auditController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(AuditController);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('admin'));

router.get('/entity/:entityType/:entityId', controller.getEntityHistory.bind(controller));

router.get('/user/:userId', controller.getUserActivity.bind(controller));

router.get('/search', controller.searchAuditLogs.bind(controller));

export default router;