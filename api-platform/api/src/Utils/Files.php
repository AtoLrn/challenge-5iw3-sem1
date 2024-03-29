<?php

namespace App\Utils;

use Ramsey\Uuid\Uuid;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\HttpKernel\KernelInterface;

class Files
{
    private $appKernel;

    public function __construct(KernelInterface $appKernel)
    {
        $this->appKernel = $appKernel;
    }

    public function upload(mixed $file): string {
        $idGenerator = UUid::uuid4();
        $fileName = $idGenerator->toString().".".$file->guessExtension();

        $destination = $this->appKernel->getProjectDir()."/files";
        $file->move($destination, $fileName);

        $s3 = new S3Client([
            'version' => 'latest',
            'region'  => 'eu-west-1',
            'credentials' => [
                'key' => $_ENV['AWS_KEY'],
                'secret' => $_ENV['AWS_SECRET'],
            ]
        ]);

        try {
            $s3->putObject([
                'Bucket' => 'inkit-s3',
                'Key'    => $fileName,
                'Body'   => fopen($destination."/".$fileName, 'r'),
                'ACL'    => 'public-read',
            ]);
        } catch (S3Exception $e) {
            throw new UnprocessableEntityHttpException("There was an error uploading the file.\n".$e);
        }

        return $_ENV['S3_URL'].$fileName;
    }
}
