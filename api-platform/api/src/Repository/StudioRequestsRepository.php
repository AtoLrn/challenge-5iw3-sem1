<?php

namespace App\Repository;

use App\Entity\StudioRequests;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<StudioRequests>
 *
 * @method StudioRequests|null find($id, $lockMode = null, $lockVersion = null)
 * @method StudioRequests|null findOneBy(array $criteria, array $orderBy = null)
 * @method StudioRequests[]    findAll()
 * @method StudioRequests[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StudioRequestsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, StudioRequests::class);
    }

//    /**
//     * @return StudioRequests[] Returns an array of StudioRequests objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('s.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?StudioRequests
//    {
//        return $this->createQueryBuilder('s')
//            ->andWhere('s.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
