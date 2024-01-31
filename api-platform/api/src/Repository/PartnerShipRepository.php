<?php

namespace App\Repository;

use App\Entity\PartnerShip;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PartnerShip>
 *
 * @method PartnerShip|null find($id, $lockMode = null, $lockVersion = null)
 * @method PartnerShip|null findOneBy(array $criteria, array $orderBy = null)
 * @method PartnerShip[]    findAll()
 * @method PartnerShip[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PartnerShipRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PartnerShip::class);
    }

//    /**
//     * @return PartnerShip[] Returns an array of PartnerShip objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PartnerShip
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
