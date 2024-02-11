<?php

namespace App\Repository;

use App\Entity\BookRequest;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BookRequest>
 *
 * @method BookRequest|null find($id, $lockMode = null, $lockVersion = null)
 * @method BookRequest|null findOneBy(array $criteria, array $orderBy = null)
 * @method BookRequest[]    findAll()
 * @method BookRequest[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookRequestRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BookRequest::class);
    }

//    /**
//     * @return BookRequest[] Returns an array of BookRequest objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('b.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?BookRequest
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
