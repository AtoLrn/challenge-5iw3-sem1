<?php

namespace App\Repository;

use App\Entity\PostPicture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PostPicture>
 *
 * @method PostPicture|null find($id, $lockMode = null, $lockVersion = null)
 * @method PostPicture|null findOneBy(array $criteria, array $orderBy = null)
 * @method PostPicture[]    findAll()
 * @method PostPicture[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PostPictureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PostPicture::class);
    }

//    /**
//     * @return PostPicture[] Returns an array of PostPicture objects
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

//    public function findOneBySomeField($value): ?PostPicture
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
