import { container } from "@config/diContainer";
import { Router } from 'express';
import { AuditController } from '@controller/auditController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = Router();
const controller = container.resolve(AuditController);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('admin'));

router.get('/', controller.getAuditLogs.bind(controller));
router.get('/user/:id', controller.getAuditLogsByUserId.bind(controller));
router.get('/entity/:id', controller.getAuditLogsByEntityId.bind(controller));

export default router;