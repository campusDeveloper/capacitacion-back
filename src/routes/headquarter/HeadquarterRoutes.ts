import { Router } from 'express';
import { HeadquarterController } from '../../controllers/config/HeadquarterController';
import { validateSchema as ValidateSchema } from '../../middlewares/ValidateSchema'; 
import { AuthMiddleware } from '../../middlewares/AuthMiddleware';
import { 
  CreateKnowledgeSchema, 
  UpdateKnowledgeSchema, 
  CreateDocBodySchema ,
  HeadquarterIdParamSchema,
  HeadquarterListParamSchema,
  KnowledgeIdParamSchema,
  DocIdParamSchema,
} from '../../validators/headquearter/HeadquarterValidator';



const router = Router();

// Tarea A: GET domain.com/api/configuration/conocimiento/headquarters
router.get(
  '/configuration/conocimiento/headquarters',
  AuthMiddleware,
  HeadquarterController.getHeadquartersWithKnowledge
);

// Tarea B: PUT domain.com/api/configuration/conocimiento/headquarter/{idHeadquarter}/change-state
router.put(
  '/configuration/conocimiento/headquarter/:id/change-state',
  AuthMiddleware,
  ValidateSchema(HeadquarterIdParamSchema),
  HeadquarterController.switchState
);

// ─── TAREA B: DETALLE DE CONOCIMIENTO ────────────────────────────────────

// 1. Listado detallado de sede (Categorías y Docs)
router.get(
  '/configuration/conocimiento/headquarter/:idHeadquarter/list',
  AuthMiddleware,
  ValidateSchema(HeadquarterListParamSchema),
  HeadquarterController.getHeadquarterDetailList
);

// 2. Gestión de Categorías (Knowledge)
router.put(
  '/configuration/conocimiento/headquarter/knowledge/:idKnowledge/change-state',
  AuthMiddleware,
  ValidateSchema(KnowledgeIdParamSchema),
  HeadquarterController.switchKnowledgeState
);

router.delete(
  '/configuration/conocimiento/headquarter/knowledge/:idKnowledge/delete',
  AuthMiddleware,
  ValidateSchema(KnowledgeIdParamSchema),
  HeadquarterController.deleteKnowledge
);

// 3. Gestión de Documentos (Docs)
router.put(
  '/configuration/conocimiento/headquarter/knowledge/doc/:idDoc/change-state',
  AuthMiddleware,
  ValidateSchema(DocIdParamSchema),
  HeadquarterController.switchDocState
);

router.delete(
  '/configuration/conocimiento/headquarter/knowledge/doc/:idDoc/delete',
  AuthMiddleware,
  ValidateSchema(DocIdParamSchema),
  HeadquarterController.deleteDoc
);

// --- AGREGA ESTAS RUTAS AL FINAL DEL ARCHIVO ---

// Crear nueva categoría
router.post(
  '/configuration/conocimiento/headquarter/knowledge/create',
  AuthMiddleware,
  ValidateSchema(CreateKnowledgeSchema),
  HeadquarterController.createKnowledge
);

// Editar título/descripción de categoría
router.put(
  '/configuration/conocimiento/headquarter/knowledge/:idKnowledge/edit',
  AuthMiddleware,
  ValidateSchema(KnowledgeIdParamSchema),
  ValidateSchema(UpdateKnowledgeSchema),
  HeadquarterController.updateKnowledge
);

// Agregar nuevo documento (Requiere FormData)
router.post(
  '/configuration/conocimiento/headquarter/knowledge/doc/create',
  AuthMiddleware,
  ValidateSchema(CreateDocBodySchema),
  HeadquarterController.createDoc
);

export default router;

